<?php
function pr() {
    $args = func_get_args();
    printf("<pre hidden>%s</pre>",print_r($args, true));
}

function printd() {
    $args = func_get_args();
    printf("<pre hidden>%s</pre>",var_dump($args));
}

function printr() {
    $args = func_get_args();
    $check = end($args) == 1 && count($args) > 1;

    if ($check) 
            $args = count($args) == 2 ? reset($args) : array_pop($args);
    
    echo "<pre hidden>";
    print_r($args);
    echo "</pre>";
}

function cl()
{
    $args = func_get_args();
    $_ = json_encode($args);

    $backtrace = debug_backtrace();
    // $cp = $backtrace[2]["file"] . ", " . $backtrace[2]["line"];
            // console.log('$cp');

    $js = <<<JSCODE
        \n<script>
            if (! window.console) console = {};
            console.log = console.log || function(name, data){};
            console.log($_);
        </script>
JSCODE;

    echo $js;
}
?>

<?php
/* * /
$ds = DIRECTORY_SEPARATOR;
 
$storeFolder = 'uploads'; // Указываем папку для загрузки
 
if (!empty($_FILES)) { // Проверяем пришли ли файлы от клиента
     
    $tempFile = $_FILES['file']['tmp_name']; //Получаем загруженные файлы из временного хранилища
      
    $targetPath = dirname( __FILE__ ) . $ds. $storeFolder . $ds;
     
    $targetFile =  $targetPath. $_FILES['file']['name'];
 
    move_uploaded_file($tempFile,$targetFile); // Перемещаем загруженные файлы из временного хранилища в нашу папку uploads
} else {                                                           
    $result  = array();
 
    $files = scandir($storeFolder); // Функция PHP scandir просматривает папку uploads и возращает массив файлов или значение FALSE елси папка пуста
    if ( false!==$files ) {
        foreach ( $files as $file ) {
            if ( '.'!=$file && '..'!=$file) { // Перебираем возвращаемое значение из функции scandir и сохраняем в массив $ result. Помните, мы игнорируем "." И "..", поскольку scandir всегда будет возвращать "." И ".." в качестве допустимого содержимого, относящегося к текущему и предыдущему каталогу
                $obj['name'] = $file;
                $obj['size'] = filesize($storeFolder.$ds.$file);
                $result[] = $obj;
            }
        }
    }
     
    header('Content-type: text/json'); // Выводим правильные заголовки для разметки JSON, а также конвертируем PHP-массив в JSON-строку, используя функцию json_encode
    header('Content-type: application/json');
    echo json_encode($result);
}
/**/
?>

<?php

$target_dir = "uploads/";
$target_file = $target_dir . basename($_FILES["file"]["name"]);


if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_dir.$_FILES['file']['name'])) {
    header('Content-type: text/json'); // Выводим правильные заголовки для разметки JSON, а также конвертируем PHP-массив в JSON-строку, используя функцию json_encode
    header('Content-type: application/json');
    echo json_encode(array("success" => true, "R" => "H", "renderId" => 1, 'file' => $target_file));
}