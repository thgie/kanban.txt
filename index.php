<?php

    if(isset($_POST['action'])){
        if($_POST['action'] == 'move'){
            $file = explode('/', $_POST['item']);
            $file = $file[count($file)-1];

            rename($_POST['item'], $_POST['target'].'/'.$file);

            echo $_POST['target'].'/'.$file;
        }
        if($_POST['action'] == 'add'){
            file_put_contents($_POST['target'].'/'.$_POST['label'].'.txt', '');

            echo $_POST['target'].'/'.$_POST['label'].'.txt';
        }
        if($_POST['action'] == 'delete'){
            unlink($_POST['target']);
        }
        return;
    }


    $content = './content/';

    require_once 'template/index.php';

    function remove_utf8_bom($text) {
        $bom = pack('H*','EFBBBF');
        $text = preg_replace("/^$bom/", '', $text);
        return $text;
    }

    function kanban($dir){
        $ffs = scandir($dir);

        unset($ffs[array_search('.', $ffs, true)]);
        unset($ffs[array_search('..', $ffs, true)]);

        if (count($ffs) < 1)
            return;

        echo '<ul>';
        foreach($ffs as $ff){

            $path = str_replace('//', '/', $dir.'/'.$ff);

            $label = str_replace('.txt', '', $ff);
            $label = substr($label, ($pos = strpos($label, '. ')) !== false ? $pos + 1 : 0);

            echo '<li data-path="'.$path.'">';
            echo '<span>'.$label.'</span>';
            if(is_dir($dir.'/'.$ff)) kanban($dir.'/'.$ff);
            echo '</li>';
        }
        echo '</ul>';
    }