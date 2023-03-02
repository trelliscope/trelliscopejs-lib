sed -i .bak 's/..\/..\/static/..media/g' build/static/css/*

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

rm -rf ../trelliscope/inst/htmlwidgets/lib/trelliscope_widget/js
rm -rf ../trelliscope/inst/htmlwidgets/lib/trelliscope_widget/css
rm -rf ../trelliscope/inst/htmlwidgets/lib/trelliscope_widget/media
mkdir ../trelliscope/inst/htmlwidgets/lib/trelliscope_widget/js
mkdir ../trelliscope/inst/htmlwidgets/lib/trelliscope_widget/css
mkdir ../trelliscope/inst/htmlwidgets/lib/trelliscope_widget/media
cp build/static/js/*.js ../trelliscope/inst/htmlwidgets/lib/trelliscope_widget/js/
cp build/static/css/*.css ../trelliscope/inst/htmlwidgets/lib/trelliscope_widget/css/
cp build/static/media/* ../trelliscope/inst/htmlwidgets/lib/trelliscope_widget/media/

JS=`find build/static/js -name '*.js' -exec basename {} \; | sed 's/^/     js\//' | sed 's/$/,/'`
CSS=`find build/static/css -name '*.css' -exec basename {} \; | sed 's/^/     css\//' | sed 's/$/,/'`

cat <<EOF >../trelliscope/inst/htmlwidgets/trelliscope_widget.yaml
dependencies:
  - name: trelliscope_widget
    version: $PACKAGE_VERSION
    src: htmlwidgets/lib/trelliscope_widget
    script: [ $JS ]
    stylesheet: [ $CSS ]
EOF
