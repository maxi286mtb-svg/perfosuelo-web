
<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Cargar PHPMailer
require __DIR__ . '/vendor/autoload.php';

// Cargar configuración
$mailConfig = require __DIR__ . '/config/mail.php';

// Solo aceptar solicitudes POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Método no permitido.');
}

// Obtener y limpiar datos del formulario
$nombre   = trim($_POST['nombre'] ?? '');
$empresa  = trim($_POST['empresa'] ?? '');
$email    = trim($_POST['email'] ?? '');
$telefono = trim($_POST['telefono'] ?? '');
$servicio = trim($_POST['servicio'] ?? '');
$mensaje  = trim($_POST['mensaje'] ?? '');


// Protección anti-spam (honeypot)
// Los usuarios normales dejan este campo vacío.
// Si tiene contenido, probablemente se trate de un bot.
$website = trim($_POST['website'] ?? '');

if ($website !== '') {
    http_response_code(400);
    exit('Solicitud no válida.');
}

// ==========================================================
// LÍMITE DE FRECUENCIA ANTI-SPAM
// Máximo 3 envíos cada 10 minutos por IP
// ==========================================================

$maxAttempts = 3;
$timeWindow = 10 * 60; // 10 minutos

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

// Archivo temporal asociado a la IP
$rateLimitFile = sys_get_temp_dir() . '/perfosuelo_' . md5($ip) . '.json';

// Obtener registros anteriores
$attempts = [];

if (file_exists($rateLimitFile)) {
    $data = file_get_contents($rateLimitFile);

    if ($data !== false) {
        $attempts = json_decode($data, true) ?? [];
    }
}

// Eliminar intentos que ya están fuera de la ventana de tiempo
$now = time();

$attempts = array_filter(
    $attempts,
    function ($timestamp) use ($now, $timeWindow) {
        return ($now - $timestamp) < $timeWindow;
    }
);

// Comprobar límite
if (count($attempts) >= $maxAttempts) {
    http_response_code(429);
    exit('Demasiadas solicitudes. Por favor intentá nuevamente más tarde.');
}

// Registrar este intento
$attempts[] = $now;

file_put_contents(
    $rateLimitFile,
    json_encode(array_values($attempts)),
    LOCK_EX
);




// Validaciones básicas

// ==========================================================
// VALIDACIONES DEL FORMULARIO
// ==========================================================

// Campos obligatorios
if ($nombre === '' || $email === '' || $mensaje === '') {
    http_response_code(400);
    exit('Por favor completá los campos obligatorios.');
}

// Email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    exit('El email ingresado no es válido.');
}

// Longitud del nombre
if (mb_strlen($nombre) > 100) {
    http_response_code(400);
    exit('El nombre ingresado es demasiado largo.');
}

// Longitud de empresa
if (mb_strlen($empresa) > 150) {
    http_response_code(400);
    exit('El nombre de la empresa es demasiado largo.');
}

// Longitud del teléfono
if (mb_strlen($telefono) > 50) {
    http_response_code(400);
    exit('El teléfono ingresado es demasiado largo.');
}

// Longitud del email
if (mb_strlen($email) > 150) {
    http_response_code(400);
    exit('El email ingresado es demasiado largo.');
}

// Longitud del mensaje
if (mb_strlen($mensaje) < 10) {
    http_response_code(400);
    exit('El mensaje es demasiado corto.');
}

if (mb_strlen($mensaje) > 3000) {
    http_response_code(400);
    exit('El mensaje es demasiado largo.');
}

// Servicios permitidos
$serviciosPermitidos = [
    '',
    'pozos',
    'pilotes',
    'micropilotes',
    'recalce',
    'estudios',
    'otro'
];

if (!in_array($servicio, $serviciosPermitidos, true)) {
    http_response_code(400);
    exit('El servicio seleccionado no es válido.');
}



// Crear instancia de PHPMailer
$mail = new PHPMailer(true);

try {

    // Configuración SMTP
    $mail->isSMTP();
    $mail->Host       = $mailConfig['host'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $mailConfig['username'];
    $mail->Password   = $mailConfig['password'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = $mailConfig['port'];

    // Remitente y destinatario
    $mail->setFrom(
        $mailConfig['username'],
        'Web Perfosuelo'
    );

    $mail->addAddress(
        $mailConfig['username'],
        'Perfosuelo'
    );

    // El email del visitante queda como Reply-To
    $mail->addReplyTo(
        $email,
        $nombre
    );

    // Asunto
    $mail->Subject = 'Nueva consulta desde la web - Perfosuelo';

    // Cuerpo HTML
    $mail->isHTML(true);

    $mail->Body = '
        <h2>Nueva consulta desde la web</h2>

        <p><strong>Nombre:</strong> ' . htmlspecialchars($nombre) . '</p>
        <p><strong>Empresa:</strong> ' . htmlspecialchars($empresa) . '</p>
        <p><strong>Email:</strong> ' . htmlspecialchars($email) . '</p>
        <p><strong>Teléfono:</strong> ' . htmlspecialchars($telefono) . '</p>
        <p><strong>Servicio:</strong> ' . htmlspecialchars($servicio) . '</p>

        <hr>

        <p><strong>Mensaje:</strong></p>
        <p>' . nl2br(htmlspecialchars($mensaje)) . '</p>
    ';

    // Versión de texto plano
    $mail->AltBody =
        "Nueva consulta desde la web - Perfosuelo\n\n" .
        "Nombre: $nombre\n" .
        "Empresa: $empresa\n" .
        "Email: $email\n" .
        "Teléfono: $telefono\n" .
        "Servicio: $servicio\n\n" .
        "Mensaje:\n$mensaje";

    // Enviar
$mail->send();

// Redirigir a la página de confirmación
header('Location: /src/pages/contacto/enviado.html');
exit;

} catch (Exception $e) {

    http_response_code(500);

    echo 'No se pudo enviar la consulta.';

}

