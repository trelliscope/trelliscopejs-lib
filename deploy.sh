sed -i .bak 's/..\/..\/static/../g' build/static/css/*

# remove hash from font file names (R complains about long file names)
sed -i .bak 's/\.[a-fA-F0-9]\{20\}\.woff/.woff/g' build/static/css/*
# this may require apt install or brew install 'rename'
rename -f 's/\.[a-fA-F0-9]{20}\.woff$/.woff/' build/static/media/poppins-*-normal.*.woff
rename -f 's/\.[a-fA-F0-9]{20}\.woff2$/.woff2/' build/static/media/poppins-*-normal.*.woff2
rename -f 's/\.[a-fA-F0-9]{20}\.woff$/.woff/' build/static/media/jost-*-normal.*.woff
rename -f 's/\.[a-fA-F0-9]{20}\.woff2$/.woff2/' build/static/media/jost-*-normal.*.woff2
rename -f 's/\.[a-fA-F0-9]{20}\.woff$/.woff/' build/static/media/source-code-pro-*-normal.*.woff
rename -f 's/\.[a-fA-F0-9]{20}\.woff2$/.woff2/' build/static/media/source-code-pro-*-normal.*.woff2

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
