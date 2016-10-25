(Device = new Layer
		image: "http://resources.framerjs.com/static/DeviceResources/apple-iphone-6s-space-gray.png"
		width: 874, height: 1792

	screenObject = Screen
	Screen = new Layer
		width: 750, height: 1334
		backgroundColor: "black"
		parent: Device
		clip: true
		x: Align.center(), y: Align.center()

	(window.onresize = ->
		Device.scale = screenObject.height / (Device.height + 50)
		Device.center())())


scroll = new ScrollComponent
  parent:Screen
  y: 0
  width: Screen.width
  height: Screen.height
  scrollHorizontal: false


buttons = []
layers = []
image =[]


for i in [0..10]

######### BUTTONS ############
	buttons[i] = new Layer
    #parent:Screen
    parent: scroll.content
    width: 200, height: 200
    backgroundColor: "#C2185B"
    x: Align.right()
    opacity: 1.00
    y: i * 205
    scale: .5
  buttons[i].states.offButton=
    scale: .5
    animationOptions:
      curve:"ease"
      time: 0.3
  buttons[i].states.onButton=
    scale:1
    animationOptions:
      curve:"ease"
      time: 0.3

  image[i] = new Layer
    parent: buttons[i]
    image: "images/ic_delete_white_24dp_2x.png"
    width: 88, height: 88
    x: Align.center
    y: Align.center
#############################


######### LAYERS ############
	layers[i] = new Layer
    #parent:Screen
    parent: scroll.content
    width: Screen.width
    y: i * 205
    backgroundColor: Utils.randomColor()
    image: Utils.randomImage()
  layers[i].states.stateOff=
    x: 0
    animationOptions:
      curve:"ease"
      time: 0.3
  layers[i].states.stateOn=
    x: -200
    animationOptions:
      curve:"ease"
      time: 0.5
  layers[i].states.stateDeleted=
    x: -750
    animationOptions:
      curve:"ease"
      time: 0.5
##############################


  layers[i].draggable.enabled = true
  layers[i].draggable.vertical = false
	layers[i].draggable.momentum = false

	layers[i].onDragMove ->
		scroll.scrollVertical = false

	layers[i].onDragEnd ->
    crnt = 0
    for layer, i in layers
		  # Как не потерять i
      if this is layer
        crnt = i
    	####################
      if this.x < -200
        this.animate("stateOn")
        buttons[crnt].animate("onButton")

        for layer, i in layers
          if layer != this and layer.states.current.name != "stateDeleted"
            layer.animate("stateOff")
            buttons[i].animate("offButton")
      else
        this.animate("stateOff")
        for layer,i in layers
          if layer is this
            buttons[i].animate("offButton")
					scroll.scrollVertical = true ##как так?

  ######## УДАЛЕНИЕ #################
	buttons[i].onClick ->
    crnt = 0
    for button, i in buttons
      if this is button
        crnt = i

    layers[crnt].animate("stateDeleted")
    #print layers[crnt].states.current.name
    buttons[crnt].animate(x: 874)

    for i in [crnt..10]
      layers[i].animate
        y: layers[i].y-205
        options:
          delay: .6
          time: 0.3

      buttons[i].animate
        y: layers[i].y-205
        options:
          delay: .6
          time: 0.3

	layers[i].onAnimationEnd ->
		scroll.updateContent()

scroll.onScrollStart ->
    for layer in layers
        layer.draggable.horizontal = false
scroll.onScrollEnd ->
    for layer in layers
        layer.draggable.horizontal = true
