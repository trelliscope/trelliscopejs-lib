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

rm -rf ../trelliscope/inst/htmlwidgets/lib/trs/js
rm -rf ../trelliscope/inst/htmlwidgets/lib/trs/css
rm -rf ../trelliscope/inst/htmlwidgets/lib/trs/media
mkdir ../trelliscope/inst/htmlwidgets/lib/trs/js
mkdir ../trelliscope/inst/htmlwidgets/lib/trs/css
mkdir ../trelliscope/inst/htmlwidgets/lib/trs/media
cp build/static/js/*.js ../trelliscope/inst/htmlwidgets/lib/trs/js/
cp build/static/css/*.css ../trelliscope/inst/htmlwidgets/lib/trs/css/
cp build/static/media/* ../trelliscope/inst/htmlwidgets/lib/trs/media/

JS=`find build/static/js -name '*.js' -exec basename {} \; | sed 's/^/     js\//' | sed 's/$/,/'`
CSS=`find build/static/css -name '*.css' -exec basename {} \; | sed 's/^/     css\//' | sed 's/$/,/'`

cat <<EOF >../trelliscope/inst/htmlwidgets/trs.yaml
dependencies:
  - name: trs
    version: $PACKAGE_VERSION
    src: htmlwidgets/lib/trs
    script: [ $JS ]
    stylesheet: [ $CSS ]
EOF
