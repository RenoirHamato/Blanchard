<?php
 
require './phpmailer/Exception.php';
require './phpmailer/PHPMailer.php';
require './phpmailer/SMTP.php';
 
$mail = new PHPMailer\PHPMailer\PHPMailer();
$subject = "Заявка на рассылку";
$c = true;

foreach($_POST as $key => $value) {
    $body .= "
    " . (($c = !$c) ? '<tr>' : '<tr style="background-color: #f8f8f8;">') . "
        <td style='padding: 10px; border: 1px solid #e9e9e9;'><b>$key</b></td>
        <td style='padding: 10px; border: 1px solid #e9e9e9;'>$value</td>
    </tr>
    ";
}

$body = "<table style='width: 100%;'>$body</table>";

try {
    $mail->isSMTP();
    $mail->CharSet = 'UTF-8';
    $mail->SMTPAuth = true;
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPSecure = 'ssl';
    $mail->Port = 465;
    $mail->Username = 'blanchard.mailing@gmail.com';
    $mail->Password = 'ufhgxjdbzjsoicxv';
    $mail->setFrom('blanchard.mailing@gmail.com', 'Blanchard - художественная галерея');		
    $mail->addAddress('dzhekvorobey1@gmail.com', 'Алешин Алексей');
    $mail->Subject = $subject;
    $mail->msgHTML($body);
    $mail->send();
} catch (Exception $e) {
    $status = "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
    echo $status;
}

if(!$mail->send()) {
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
    echo 'Message has been sent';
}
?>