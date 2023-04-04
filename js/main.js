//add event listeners to the search bar
const submit = document.querySelector('#submit')

submit.addEventListener('click', define)
document.querySelector('#word').addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        submit.click();
    }
});

//sentence case input
function toSentenceCase(str) {
    let arr = str.split('')
    let firstLetter = arr.shift()
    arr.unshift(firstLetter.toUpperCase())
    return arr.join('')
}

//define
function define() {
    const word = document.querySelector('#word').value
    const wordDisplay = document.querySelector('#wordDisplay')
    const output = document.querySelector('#output')
    const phoneticText = document.querySelector('#phoneticText')
    const phoneticOutput = document.querySelector('#phonetics')
    const dictionary = document.querySelector('.dictionary')

    if (word == '') {
        dictionary.classList.add('visible')
        word.value = ''
        wordDisplay.innerHTML = ''
        phoneticText.innerHTML = ''
        phoneticOutput.innerHTML = ''
        output.innerHTML = 'Please enter a word.'
    } else {
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(res => res.json())
        .then(data => {
            console.log('Dictionary API:')
            console.log(data)

            //input validation
            if (data.title == 'No Definitions Found') {
                dictionary.classList.add('visible')
                word.value = ''
                wordDisplay.innerHTML = ''
                phoneticText.innerHTML = ''
                phoneticOutput.innerHTML = ''
                output.innerHTML = 'No definitions found.'
            } else {
                dictionary.classList.add('visible')
                //output word
                wordDisplay.innerHTML = `${toSentenceCase(word)}`
        
                //pull definitions
                const meanings = data[0].meanings
                const definitions = []
                for (let i = 0; i < meanings.length; i++) {
                    for (let j = 0; j < meanings[i].definitions.length; j++) {
                        definitions.push(`<li> ${meanings[i].definitions[j]?.definition} - <span class="partOfSpeech">${meanings[i].partOfSpeech}</span></li>`)
                    }
                }
                output.innerHTML = `<ol>${definitions.join('')}</ol>`
        
                //pull phonetics
                let phoneticAudio = data[0].phonetics
                if (phoneticAudio.length == 0) {
                    phoneticOutput.innerHTML = `<span class="small">(Phonetic audio is not available for this word.)</span>`
                    phoneticText.innerHTML = `<span class="small">(Phonetic pronunciation is not available for this word.)</span>`
                } else {
                    for (let i = 0; i < phoneticAudio.length; i++) {
                        if (phoneticAudio[i].audio) {
                            phoneticOutput.innerHTML = `<audio controls src="${phoneticAudio[i].audio}"></audio>`
                            break
                        } else {
                            phoneticOutput.innerHTML = `<span class="small">(Phonetic audio is not available for this word.)</span>`
                        }
                    }
                    for (let i = 0; i < data[0].phonetics.length; i++) {
                        if (data[0].phonetics[i].text !== undefined) {
                            phoneticText.innerHTML = data[0].phonetics[i].text
                            break
                        }
                    }
                }
                
            }
        })
        .catch(err => console.log(`error: ${err}`))
    }

    
}
