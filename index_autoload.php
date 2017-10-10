<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    
    <meta name="apple-mobile-web-app-capable" content="yes">
<!--	<meta name="apple-mobile-web-app-status-bar-style" content="black" />-->
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    
    <!-- set iOS icons -->
    <link rel="apple-touch-icon" href="ios/touch-icon-iphone.png" />
    <link rel="apple-touch-icon" sizes="72x72" href="ios/touch-icon-ipad.png" />
    <link rel="apple-touch-icon" sizes="114x114" href="ios/touch-icon-iphone4.png" />
    
    <!-- set iOS launch image -->
    <link rel="apple-touch-startup-image" href="ios/startup.png">
    
    <!-- set viewport for smartphones -->
    <meta name="viewport" content="width=device-width, maximum-scale=1.0">
    
    <!-- web font -->
    <link href='http://fonts.googleapis.com/css?family=Aldrich' rel='stylesheet' type='text/css'>
    
    <!-- favicon -->
    <link rel="shortcut icon" href="favicon.ico" />
    
    <title>HTML5 Shooter (WIP)</title>
    
    <style>
        html {
            height: 100%;
        }
        
        body {
            margin: 0px;
            height: 100%;
            
            background-color: #000;
            
            /* prevent scroll bars */
            overflow: hidden;
        }
        
        #gamescreen {
            width: 100%;
            height: 100%;
            
/*			width: 480px;
            height: 480px;*/
            
            /* disable copy & paste on iOS */
            -webkit-user-select: none;

            position: relative;
        }

        #debug {
            color: #FFF;
            position: absolute;
        }
    </style>
</head>
<body>
    <div id="gamescreen">
        <div id="debug"></div>
    </div>

<?php

# import source files automatically

import("gamelib/header.js");
ls("gamelib");

echo "\n";

import("src/header.js");
ls("src");

function ls($directory) {
    $dir = dir($directory);
    
    while ($file = $dir->read()) {
        if ($file == "." || $file == "..") {
            continue;
        }
        
        $fullpath = $directory."/".$file;
        
        if (is_dir($fullpath)) {
            ls($fullpath);
            continue;
        }
        
        if ($file != "header.js") {
            import($fullpath);
        }
    }
}

function import($fullpath) {
    echo "<script src=\"".$fullpath."\"></script>\n";
}

?>

</body>
</html>


