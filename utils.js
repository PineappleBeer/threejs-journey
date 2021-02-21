export const generateExerciseModes = (modes = [], defaultMode) => {
  const initialMode = defaultMode ? defaultMode : modes[0].name
  const ref = { name: initialMode }

  const wrapper = document.createElement('div')
  wrapper.style.marginBottom = '10px'

  modes.forEach(mode => {
    const button = document.createElement('button')

    button.textContent = mode.name
    button.style.margin = '5px'

    button.addEventListener('click', event => {
      ref.name = mode.name
      mode.handler(event)
    })
    wrapper.append(button)

    if (mode.name === initialMode) button.click()
  })

  document.body.prepend(wrapper)

  return ref
}
