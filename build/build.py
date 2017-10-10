#! /usr/bin/python

import os
import base64

def list_files(dir):
    list = []
    
    for root, dirs, files in os.walk(dir):
        for file in files:
            fullpath = os.path.join(root, file).replace("\\", "/")
            
            list.append(fullpath)
    
    return list


def remove_files(list, files):
    for file in files:
        if file in list:
            list.remove(file)


def convert_image_files(output_file, image_files, property):
    if len(image_files) > 0:
        output = "var " + property + " = {\n"
        
        for file in image_files:
            print(file)
            
            id = file.replace("./", "")
            
            fin = open(file, "rb")
            binary = fin.read()
            fin.close()
            
            output += '\t"' + id + '" : "data:image/png;base64,' + base64.b64encode(binary).decode('ascii') + '",\n'
        
        output = output[0:-2]
        output += "\n};\n"
        
        with open(output_file, "w") as fout:
            fout.write(output)


def concat_files(output_file, in_files):
    with open(output_file, "w", encoding='utf-8') as fout:
        for file in in_files:
            print(file)
            
            with open(file, encoding='utf-8') as fin:
                src = fin.read()
            
            fout.write(src)


PROJECT_JS = "build/bin/HTML5Shooter.js"
PROJECT_OPTIMIZED_JS = "build/bin/HTML5Shooter-min.js"
SOURCE_MAP_JS = "build/bin/HTML5Shooter-min.js.map"

# create gamelib.js

GAMELIB_JS = "build/bin/gamelib.js"
GAMELIB_HEADER = "gamelib/header.js"

os.chdir("..")

gamelib_files = list_files("gamelib")
remove_files(gamelib_files, [GAMELIB_HEADER])

gamelib_files = [GAMELIB_HEADER] + gamelib_files
concat_files(GAMELIB_JS, gamelib_files)


# create images.js

IMAGES_JS = "build/obj/images.js"

os.chdir('resources/images');

image_files = list_files('.')
convert_image_files("../../" + IMAGES_JS, image_files, 'IMAGES');

os.chdir("../../");


# create project .js

files = [GAMELIB_JS, IMAGES_JS] + list_files("src")
concat_files(PROJECT_JS, files)


# create optimized project .js

#compiler = "java -jar build/compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --js " + PROJECT_JS + " --js_output_file " + PROJECT_OPTIMIZED_JS + " --create_source_map " + SOURCE_MAP_JS + " --source_map_format=V3"
#os.system(compiler)

optimize = "uglifyjs " + PROJECT_JS + " > " + PROJECT_OPTIMIZED_JS
os.system(optimize)


