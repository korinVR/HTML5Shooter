set JSDOC=E:\Commands\jsdoc-toolkit
set TEMPLATE=%JSDOC%\templates\jsdoc

set SRC_DIR=../gamelib/

java -Djsdoc.dir=%JSDOC% -Djsdoc.template.dir=%TEMPLATE% -jar %JSDOC%\jsrun.jar %JSDOC%\app\run.js -d=jsdoc -r=4 %SRC_DIR%
