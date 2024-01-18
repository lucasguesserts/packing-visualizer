class VisibilityController {
  constructor (slider, button) {
    this.slider = slider
    this.button = button
    this.reset()
    this.slider.oninput = () => {
      this._sliderSetVisibility()
    }
    this.button.onchange = () => {
      this._setEmptySpacesVisibility()
    }
  }

  addSmallItem (smallItem) {
    this.cuboid.push(smallItem.cuboid)
    this.edges.push(smallItem.edges)
    ++this.slider.max
    ++this.slider.value
  }

  addEmptySpaceSet (emptySpaceSet) {
    this.emptySpaceSet.push(emptySpaceSet)
  }

  reset () {
    this._resetSlider()
    this._resetButton()
    this._resetData()
  }

  _resetSlider () {
    this.slider.min = 0
    this.slider.value = 0
    this.slider.max = 0
    this.slider.step = 1
  }

  _resetButton () {
    this.button.checked = false
  }

  _resetData () {
    this.cuboid = []
    this.edges = []
    this.emptySpaceSet = []
  }

  _sliderSetVisibility () {
    this._setSmallItemsVisibility()
    this._setEmptySpacesVisibility()
  }

  _setSmallItemsVisibility () {
    // set small items visibility
    // small items before 'slider.value' are visible,
    for (let i = 0; i < this.slider.value; ++i) {
      this.cuboid[i].visible = true
      this.edges[i].visible = true
    }
    // small items after 'slider.value' are invisible
    for (let i = this.slider.value; i < this.slider.max; ++i) {
      this.cuboid[i].visible = false
      this.edges[i].visible = false
    }
  }

  _setEmptySpacesVisibility () {
    // set empty spaces visibility
    // previous empty spaces are not visible
    for (const emptySpaceSet of this.emptySpaceSet) {
      for (const emptySpace of emptySpaceSet) {
        emptySpace.cuboid.visible = false
      }
    }
    // current empty spaces are visible
    // if button is checked
    if (this.slider.value > 0) {
      for (const emptySpace of this.emptySpaceSet[this.slider.value - 1]) {
        emptySpace.cuboid.visible = this.button.checked
      }
    }
  }

  _buttonSetVisibility () {
    const currentEmptySpaceSet = this.emptySpaceSet[this.slider.value]
    for (const emptySpace of currentEmptySpaceSet) {
      emptySpace.visible = this.button.checked
    }
  }
}

export default VisibilityController
