PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

rm -rf ../trelliscope/inst/htmlwidgets/lib/trs
mkdir ../trelliscope/inst/htmlwidgets/lib/trs
cp dist/assets/* ../trelliscope/inst/htmlwidgets/lib/trs/

cat <<EOF >../trelliscope/inst/htmlwidgets/trs.yaml
dependencies:
  - name: trs
    version: $PACKAGE_VERSION
    src: htmlwidgets/lib/trs
    script: [ index.js ]
    stylesheet: [ index.css ]
EOF
