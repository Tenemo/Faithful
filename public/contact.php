<?php
require 'PHPMailer-master/PHPMailerAutoload.php';

$fromEmail = 'formularz@wiernypies.pl';
$fromName = 'Formularz wiernypies.pl';

$sendToEmail = 'kontakt@wiernypies.pl';
$sendToName = 'wiernypies.pl kontakt';

$subject = 'Wiadomość z formularza kontaktowego - wiernypies.pl';

$fields = array(
    'name' => 'Imię:',
    'surname' => 'Nazwisko:',
    'phone' => 'Numer telefonu:',
    'email' => 'E-mail:',
    'message' => 'Treść wiadomości:'
);
$okMessage = 'contact.form.sentOK';
$errorMessage = 'contact.form.sentError';
error_reporting(0);

try
{
    if(count($_POST) == 0) throw new \Exception('Form is empty');
    $emailTextHtml = "<h2>Nowa wiadomość z formularza kontaktowego</h2><hr>";
    $emailTextHtml .= "<table>";
    foreach ($_POST as $key => $value) {
        if (isset($fields[$key])) {
            $emailTextHtml .= "<tr><th>$fields[$key]</th><td>$value</td></tr>";
        }
    }
    $emailTextHtml .= "</table>";
    $mail = new PHPMailer;
    $mail->CharSet = "UTF-8";
    $mail->setFrom($fromEmail, $fromName);
    $mail->addAddress($sendToEmail, $sendToName);
    $mail->addReplyTo($from);
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->msgHTML($emailTextHtml); 
    if(!$mail->send()) {
        throw new \Exception('I could not send the email.' . $mail->ErrorInfo);
    }
    $responseArray = array('type' => 'success', 'message' => $okMessage);
}
catch (\Exception $e)
{
    $responseArray = array('type' => 'danger', 'message' => $e->getMessage());
}
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    $encoded = json_encode($responseArray);
    header('Content-Type: application/json');
    echo $encoded;
}
else {
    echo $responseArray['message'];
}