sed -i .bak 's/\/static/../g' build/static/css/*

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

rm -rf ../trelliscopejs/inst/htmlwidgets/lib/trelliscopejs_widget/js
rm -rf ../trelliscopejs/inst/htmlwidgets/lib/trelliscopejs_widget/css
rm -rf ../trelliscopejs/inst/htmlwidgets/lib/trelliscopejs_widget/media
mkdir ../trelliscopejs/inst/htmlwidgets/lib/trelliscopejs_widget/js
mkdir ../trelliscopejs/inst/htmlwidgets/lib/trelliscopejs_widget/css
mkdir ../trelliscopejs/inst/htmlwidgets/lib/trelliscopejs_widget/media
cp build/static/js/*.js ../trelliscopejs/inst/htmlwidgets/lib/trelliscopejs_widget/js/
cp build/static/css/*.css ../trelliscopejs/inst/htmlwidgets/lib/trelliscopejs_widget/css/
cp build/static/media/* ../trelliscopejs/inst/htmlwidgets/lib/trelliscopejs_widget/media/

JS=`find build/static/js -name '*.js' -exec basename {} \; | sed 's/^/     js\//' | sed 's/$/,/'`
CSS=`find build/static/css -name '*.css' -exec basename {} \; | sed 's/^/     css\//' | sed 's/$/,/'`

cat <<EOF >../trelliscopejs/inst/htmlwidgets/trelliscopejs_widget.yaml
dependencies:
 - name: trelliscopejs_widget
   version: $PACKAGE_VERSION
   src: htmlwidgets/lib/trelliscopejs_widget
   script: [
$JS
   ]
   stylesheet: [
$CSS     
   ]
EOF
