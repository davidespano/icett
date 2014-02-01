

var labelType, useGradients, nativeTextSupport, animate;

(function() {
    var ua = navigator.userAgent,
            iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
            typeOfCanvas = typeof HTMLCanvasElement,
            nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
            textSupport = nativeCanvasSupport
            && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
    //I'm setting this based on the fact that ExCanvas provides text support for IE
    //and that as of today iPhone/iPad current text support is lame
    labelType = (!nativeCanvasSupport || (textSupport && !iStuff)) ? 'Native' : 'HTML';
    nativeTextSupport = labelType == 'Native';
    useGradients = nativeCanvasSupport;
    animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
    elem: false,
    write: function(text) {
        if (!this.elem)
            this.elem = document.getElementById('log');
        this.elem.innerHTML = text;
        this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
    }
};

var config = {
    zoomLevel: 1.0,
    borderLeft: 5
};

$jit.Icicle.Plot.NodeTypes.implement({
    'image': {
        'render': function(node, canvas, animating) {
            var config = this.viz.config;
            var offset = config.offset + 20;
            var hoffset = config.offset;
            var width = node.getData('width');
            
            var height = node.getData('height');
            var border = node.getData('border');
            var pos = node.pos.getc(true);
            var posx = pos.x + offset / 2, posy = pos.y + hoffset / 2;
            var ctx = canvas.getCtx();
                

            if (config.cushion) {
                var color = node.getData('color');
                var lg = ctx.createRadialGradient(posx + (width - offset) / 2,
                        posy + (height - offset) / 2, 1,
                        posx + (width - offset) / 2, posy + (height - offset) / 2,
                        width < height ? height : width);
                var colorGrad = $.rgbToHex($.map($.hexToRgb(color),
                        function(r) {
                            return r * 0.3 >> 0;
                        }));
                lg.addColorStop(0, color);
                lg.addColorStop(1, colorGrad);
                ctx.fillStyle = lg;
            }

            if (border) {
                ctx.strokeStyle = border;
                ctx.lineWidth = 3;
            }
            
            ctx.fillStyle = node.data.$backgroundColor != undefined ?
                    node.data.$backgroundColor : 'white';
                ctx.fillRect(posx, posy, Math.max(1, width - offset), Math.max(0, height - hoffset));
            ctx.strokeStyle = node.data.$color != undefined ?
                    node.data.$color : 'black';
            //ctx.strokeRect(posx, posy, Math.max(0, width - offset), Math.max(0, height - hoffset));
            if (node.Config.font != undefined) {
                ctx.font = node.Config.font;
            }

            var txtWidth = ctx.measureText(node.name).width;
            var imgWidth = 0;
            var lineHeight = ctx.measureText("M").width;
            var imgBorder = 5;
            var txt = node.name;



            if (txtWidth < width - offset - node.Config.width) {
                imgWidth = node.Config.width;
                imgBorder = 5;
            } else if (width - offset > node.Config.width) {
                // todo tagliare la stringa 
                var crCount = ((width - offset) / lineHeight) - 3;
                imgWidth = 16;
                imgBorder = 2;
                if(crCount >= 1){
                    txt = txt.substr(0, crCount) + "...";
                }else{
                    txt = "";
                }
                
                txtWidth = ctx.measureText(txt).width;
            } else {
                imgWidth = 0;
                imgBorder = 0;
                txt = "";
            }


            if (node.data &&
                    node.data.$iterative &&
                    node.data.$iterative == true) {
                txt = node.name + '*';
            }

            // disegno il tipo di task
            if (node.data.img) {
                ctx.drawImage(node.data.img,
                        posx + imgBorder,
                        posy + Math.max(0, height - hoffset - node.Config.width) / 2,
                        imgWidth,
                        imgWidth);
            }

            ctx.fillStyle = node.data.$color != undefined ?
                    node.data.$color : 'black';
            ctx.fillText(txt,
                    posx + (width - offset - txtWidth) / 2,
                    posy + height / 2);
            ctx.fillStyle = 'black';
            var opWidth = ctx.measureText(node.data.$operator).width;
            
            if ( (width - offset > 2) )  {
                ctx.fillText(node.data.$operator != undefined ? node.data.$operator: "",
                        posx + width - (opWidth + offset) / 2,
                        posy + height / 2);
            }

            // 


            border && ctx.strokeRect(pos.x, pos.y, width, height);
        },
        'contains': function(node, pos) {
            if (this.viz.clickedNode && !$jit.Graph.Util.isDescendantOf(node, this.viz.clickedNode.id))
                return false;
            var npos = node.pos.getc(true),
                    width = node.getData('width'),
                    height = node.getData('height');
            return this.nodeHelper.rectangle.contains({
                x: npos.x + width / 2,
                y: npos.y + height / 2
            }, pos, width, height);

        }
    }
});

var abstractBkg = "#3692f0";
var interactionBkg = "#5db74a";
var applicationBkg = "#e13c31";
var userBkg = "#f0af32";
var labelClr = "white";


var json = {
    "id": "node02",
    "name": "MobilePhone",
    "data": {
        "$area": 8,
        "$dim": 8,
        "$backgroundColor": abstractBkg,
        "$color": labelClr,
        "$imgUrl": "img/abstraction.png"
    },
    "children": [
        {
            "id": "node13",
            "name": "Switch on",
            "data": {
                "$area": 3,
                "$dim": 3,
                "$backgroundColor": interactionBkg,
                "$color": labelClr,
                "$imgUrl": "img/interaction.png",
                "$operator": ">>"
            }
        }, {
            "id": "node167",
            "name": "Handle communication",
            "data": {"$area": 8,
                "$dim": 16,
                "$backgroundColor": abstractBkg,
                "$color": labelClr,
                "$imgUrl": "img/abstraction.png",
                "$operator": "[>"
            },
            "children": [
                {
                    "id": "node268",
                    "name": "Connect",
                    "data": {
                        "$area": 8,
                        "$dim": 8,
                        "$backgroundColor": abstractBkg,
                        "$color": labelClr,
                        "$imgUrl": "img/abstraction.png",
                        "$operator": ">>"
                    },
                    "children": [
                        {
                            "id": "node369",
                            "name": "Display 'Enter PIN'",
                            "data": {
                                "$area": 8,
                                "$dim": 8,
                                "$backgroundColor": applicationBkg,
                                "$color": labelClr,
                                "$imgUrl": "img/system.png",
                                "$operator": ">>"
                            }
                        }, {
                            "id": "node375",
                            "name": "Enter PIN",
                            "data": {
                                "$area": 8,
                                "$dim": 8,
                                "$backgroundColor": interactionBkg,
                                "$color": labelClr,
                                "$imgUrl": "img/interaction.png",
                                "$operator": ">>"
                            }
                        }, {
                            "id": "node381",
                            "name": "Connect to network",
                            "data": {
                                "$area": 8,
                                "$dim": 8,
                                "$backgroundColor": applicationBkg,
                                "$color": labelClr,
                                "$imgUrl": "img/system.png",
                                "$operator": ">>"
                            }
                        }
                        , {
                            "id": "System",
                            "name": "Show time-battery-connectivity",
                            "data": {
                                "$area": 8,
                                "$dim": 8,
                                "$backgroundColor": applicationBkg,
                                "$color": labelClr,
                                "$imgUrl": "img/system.png"
                            }
                        }
                    ]
                }, {
                    "id": "node297",
                    "name": "Use Phone",
                    "data": {
                        "$area": 8,
                        "$dim": 8,
                        "$backgroundColor": abstractBkg,
                        "$color": labelClr,
                        "$imgUrl": "img/abstraction.png"
                    },
                    "children": [
                        {
                            "id": "node4101",
                            "name": "Decide Use",
                            "data": {
                                "$area": 8,
                                "$dim": 8,
                                "$backgroundColor": userBkg,
                                "$color": labelClr,
                                "$imgUrl": "img/user.png",
                                "$operator": ">>"
                            }
                        }, {
                            "id": "node398",
                            "name": "MakeCall",
                            "data": {
                                "$area": 8,
                                "$dim": 8,
                                "$backgroundColor": abstractBkg,
                                "$color": labelClr,
                                "$imgUrl": "img/abstraction.png",
                                "$operator": "[]"
                            },
                            "children": [
                                {
                                    "id": "node499",
                                    "name": "Select Number",
                                    "data": {
                                        "$area": 6,
                                        "$dim": 6,
                                        "$backgroundColor": abstractBkg,
                                        "$color": labelClr,
                                        "$imgUrl": "img/abstraction.png",
                                        "$operator": ">>"
                                    }
                                }, {
                                    "id": "node4100",
                                    "name": "Press Yes",
                                    "data": {
                                        "$area": 6,
                                        "$dim": 6,
                                        "$backgroundColor": interactionBkg,
                                        "$color": labelClr,
                                        "$imgUrl": "img/interaction.png",
                                        "$operator": ">>"
                                    }
                                }, {
                                    "id": "node4101",
                                    "name": "Have conversation",
                                    "data": {
                                        "$area": 6,
                                        "$dim": 6,
                                        "$backgroundColor": interactionBkg,
                                        "$color": labelClr,
                                        "$imgUrl": "img/interaction.png",
                                        "$operator": "[>"
                                    }
                                }, {
                                    "id": "node4102",
                                    "name": "Press no",
                                    "data": {
                                        "$area": 6,
                                        "$dim": 6,
                                        "$backgroundColor": interactionBkg,
                                        "$color": labelClr,
                                        "$imgUrl": "img/interaction.png"
                                    }
                                }
                            ]
                        }, {
                            "id": "node3103",
                            "name": "Use other functions",
                            "data": {
                                "$area": 8,
                                "$dim": 8,
                                "$backgroundColor": abstractBkg,
                                "$color": labelClr,
                                "$imgUrl": "img/abstraction.png"
                            },
                            "children": [
                                {
                                    "id": "node4104",
                                    "name": "Handle messages",
                                    "data": {
                                        "$area": 8,
                                        "$dim": 8,
                                        "$backgroundColor": abstractBkg,
                                        "$color": labelClr,
                                        "$imgUrl": "img/abstraction.png",
                                        "$operator": "[]"
                                    }
                                }, {
                                    "id": "node4105",
                                    "name": "Tools",
                                    "data": {
                                        "$area": 8,
                                        "$dim": 8,
                                        "$backgroundColor": abstractBkg,
                                        "$color": labelClr,
                                        "$imgUrl": "img/abstraction.png",
                                        "$operator": "[]"
                                    }
                                }, {
                                    "id": "node4106",
                                    "name": "Settings",
                                    "data": {
                                        "$area": 8,
                                        "$dim": 8,
                                        "$backgroundColor": abstractBkg,
                                        "$color": labelClr,
                                        "$imgUrl": "img/abstraction.png"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }, {
            "id": "node1200",
            "name": "Switch off",
            "data": {
                "$area": 3,
                "$dim": 3,
                "$backgroundColor": interactionBkg,
                "$color": labelClr,
                "$imgUrl": "img/interaction.png"
            }
        }
    ]
};



//init controls
function controls() {
    var jit = $jit;
    var gotoparent = jit.id('update');
    jit.util.addEvent(gotoparent, 'click', function() {
        icicle.out();
    });

}
//end