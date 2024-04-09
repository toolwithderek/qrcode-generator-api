#### JSON Body Structure
Property               |Type                     |Default Value|Description
-----------------------|-------------------------|-------------|-----------------------------------------------------
width                  |number                   |`300`        |Size of canvas
height                 |number                   |`300`        |Size of canvas
data                   |string                   |             |The date will be encoded to the QR code
image                  |string                   |             |The image URL will be copied to the center of the QR code
margin                 |number                   |`0`          |Margin around canvas
imageOptions           |object                   |             |Specific image options, details see below
dotsOptions            |object                   |             |Dots styling options
cornersSquareOptions   |object                   |             |Square in the corners styling options
cornersDotOptions      |object                   |             |Dots in the corners styling options
backgroundOptions      |object                   |             |QR background styling options

`imageOptions` structure

Property          |Type                                   |Default Value|Description
------------------|---------------------------------------|-------------|------------------------------------------------------------------------------
hideBackgroundDots|boolean                                |`true`       |Hide all dots covered by the image
imageSize         |number                                 |`0.4`        |Coefficient of the image size. Not recommended to use ove 0.5. Lower is better
margin            |number                                 |`0`          |Margin of the image in px

`dotsOptions` structure

Property|Type                                                                          |Default Value|Description
--------|------------------------------------------------------------------------------|-------------|-------------------
color   |string                                                                        |`'#000'`     |Color of QR dots
type    |string (`'rounded' 'dots' 'classy' 'classy-rounded' 'square' 'extra-rounded'`)|`'square'`   |Style of QR dots

`backgroundOptions` structure

Property|Type  |Default Value
--------|------|-------------
color   |string|`'#fff'`

`cornersSquareOptions` structure

Property|Type                                     |Default Value|Description
--------|-----------------------------------------|-------------|-----------------
color   |string                                   |             |Color of Corners Square
type    |string (`'dot' 'square' 'extra-rounded'`)|             |Style of Corners Square

`cornersDotOptions` structure

Property|Type                     |Default Value|Description
--------|-------------------------|-------------|-----------------
color   |string                   |             |Color of Corners Dot
type    |string (`'dot' 'square'`)|             |Style of Corners Dot


`downloadOptions` structure
Param    |Type                                |Default Value|Description
---------|------------------------------------|-------------|------------
extension|string (`'png' 'jpeg' 'webp' 'svg'`)|`'png'`      |Blob type

### Example

```json
{
    "data": "https:smarttrick.org",
    "width": 300,
    "height": 300,
    "image": "https://rapidapi-prod-apis.s3.amazonaws.com/a9151bc9-7822-4401-83d5-204f100056d3.jpg",
    "dotsOptions": {
        "color": "#5ab342",
        "type": "square"
    },
    "cornersSquareOptions": {
        "color": "#57a805",
        "type": "square"
    },
    "cornersDotOptions": {
        "color": "#14761a",
        "type": "square"
    },
    "backgroundOptions": {
        "color": "#ffffff"
    },
    "imageOptions": {
        "hideBackgroundDots": false,
        "imageSize": 0.4,
        "margin": 0
    },
    "downloadOptions": {
        "name": "qrcode_generated.png",
        "extension": "png"
    }
}
```
