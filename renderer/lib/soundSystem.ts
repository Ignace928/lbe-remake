export const playSound = (sound_name: string) => {
    const audio = new Audio(`/sound/${sound_name}`)
    audio.play()
}
