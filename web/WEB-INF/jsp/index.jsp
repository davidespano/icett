<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Welcome to Spring Web MVC project</title>
        <link rel="stylesheet" href="css/ui-lightness/jquery-ui-1.10.3.custom.css">

        <script type="text/javascript" src="js/jit-yc.js"></script>
        <script type="text/javascript" src="js/icicle-graph.js"></script>
        <script type="text/javascript" src="js/jquery/jquery-1.9.1.js"></script>
        <script type="text/javascript" src="js/jquery/jquery-ui-1.10.3.min.js"></script>

        <script type="text/javascript">
            $(document).ready(function() {
                var icicle;
                init();
                resize();

                $(window).on("resize", function() {
                    resize();
                });

                // init the menu button
                $("#level-up").button({
                    text: false,
                    icons: {
                        primary: "ui-icon-up"
                    }
                })
                   .click(function() {
                       icicle.out();
                 });

                function resize() {
                    var container = $('#canvas-container');
                    icicle.canvas.resize(container.width(), container.height());
                }
                function init() {
                    icicle = new $jit.Icicle({
                        // id of the visualization container
                        injectInto: 'infovis',
                        // whether to add transition animations
                        animate: animate,
                        // nodes offset
                        offset: 2,
                        // whether to add cushion type nodes
                        //cushion: true,
                        //show only three levels at a time
                        constrained: true,
                        levelsToShow: 20,
                        // enable tips
                        Node: {
                            'overridable': true,
                            'color': 'black',
                            'backgroundColor': '#cc0000',
                            'type': 'image',
                            'font': '16px arial',
                            'width': 48,
                            'height': 48,
                            'borderColor': '#000000',
                            'borderWidth': 1

                        },
                        Tips: {
                            enable: true,
                            type: 'Native',
                            // add positioning offsets
                            offsetX: 20,
                            offsetY: 20,
                            // implement the onShow method to
                            // add content to the tooltip when a node
                            // is hovered
                            onShow: function(tip, node) {
                                // count children
                                var count = 0;
                                node.eachSubnode(function() {
                                    count++;
                                });
                                // add tooltip info
                                tip.innerHTML = "<div class=\"tip-title\"><b>Name:</b> " + node.name
                                        + "</div><div class=\"tip-text\">" + count + " children</div>";
                            }
                        },
                        // Add events to nodes
                        Events: {
                            enable: true,
                            onMouseEnter: function(node) {
                                //add border and replot node
                                //node.setData('border', '#33dddd');
                                icicle.fx.plotNode(node, icicle.canvas);
                                icicle.labels.plotLabel(icicle.canvas, node, icicle.controller);
                            },
                            onMouseLeave: function(node) {
                                icicle.fx.plot();
                            },
                            onClick: function(node) {
                                if (node) {
                                    //hide tips and selections
                                    icicle.tips.hide();
                                    if (icicle.events.hovered)
                                        this.onMouseLeave(icicle.events.hovered);
                                    //perform the enter animation
                                    icicle.enter(node);
                                }
                            },
                            onRightClick: function() {
                                //hide tips and selections
                                icicle.tips.hide();
                                if (icicle.events.hovered)
                                    this.onMouseLeave(icicle.events.hovered);
                                //perform the out animation
                                icicle.out();
                            }
                        },
                        // Add canvas label styling
                        Label: {
                            type: 'HTML' // "Native" or "HTML"

                        },
                        // Add the name of the node in the corresponding label
                        // This method is called once, on label creation and only for DOM and not
                        // Native labels.
                        onCreateLabel: function(domElement, node) {
                            //domElement.innerHTML = 'pippo';
                            var style = domElement.style;
                            style.fontSize = '0.9em';
                            style.display = 'hidden';
                            style.cursor = 'pointer';
                            style.color = '#333';
                            style.overflow = 'hidden';

                        },
                        // Change some label dom properties.
                        // This method is called each time a label is plotted.
                        onPlaceLabel: function(domElement, node) {
                            var style = domElement.style,
                                    width = node.getData('width'),
                                    height = node.getData('height');
                            if (width < 7 || height < 7) {
                                style.display = 'none';
                            } else {
                                style.display = '';
                                style.width = width + 'px';
                                style.height = height + 'px';
                            }
                        }
                    });
                    // load data
                    icicle.loadJSON(json);

                    var lastNode;
                    icicle.graph.eachNode(function(node) {
                        if (node.data.$imgUrl) {
                            var img = new Image;

                            node.data.img = img;
                            node.data.img.src = node.data.$imgUrl;
                            lastNode = node;

                        }

                    });
                    if (lastNode)
                        lastNode.data.img.onload = function() {
                            icicle.refresh();
                        };
                    // compute positions and plot
                    icicle.refresh();
                }
                ;
            });
        </script>

    </head>

    <body>
        <p>Ciao Davide! This is the default welcome page for a Spring Web MVC project.</p>
        <p><i>To display a different welcome page for this project, modify</i>
            <tt>index.jsp</tt> <i>, or create your own welcome page then change
                the redirection in</i> <tt>redirect.jsp</tt> <i>to point to the new
                welcome page and also update the welcome-file setting in</i>
            <tt>web.xml</tt>.</p>
        <div id="canvas-container">
            <div id="toolbar" class="ui-widget-header ui-corner-all">
                <button id="level-up">go up one level</button>
            </div>
            <div id="infovis" style="width: 600px; height:400px;"></div>
        </div>

    </body>
</html>
