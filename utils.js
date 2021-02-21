export const generateExerciseModes = (modes = [], defaultMode) => {
  const initialMode = defaultMode ? defaultMode : modes[0].name

  const wrapper = document.createElement('div')
  wrapper.style.marginBottom = '10px'

  modes.forEach(mode => {
    const button = document.createElement('button')

    button.textContent = mode.name
    button.style.margin = '5px'

    button.addEventListener('click', mode.event)
    wrapper.append(button)

    if (mode.name === initialMode) button.click()
  })

  document.body.prepend(wrapper)
}
