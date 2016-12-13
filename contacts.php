<?php
if (array_key_exists('messageFF', $_POST)) {
   $to = 'zendik8@ukr.net';
   $subject = 'Заповнена контактна форма з '.$_SERVER['HTTP_REFERER'];
   $subject = "=?utf-8?b?". base64_encode($subject) ."?=";
   $message = "Ім'я: ".$_POST['nameFF']."\nEmail: ".$_POST['contactFF']."\nIP: ".$_SERVER['REMOTE_ADDR']."\nПовідомлення: ".$_POST['messageFF'];
   $headers = 'Content-type: text/plain; charset="utf-8"';
   $headers .= "MIME-Version: 1.0\r\n";
   $headers .= "Date: ". date('D, d M Y h:i:s O') ."\r\n";
   mail($to, $subject, $message, $headers);
   echo $_POST['nameFF'];
}
?>