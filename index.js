const {
  skillId,
  stringsNumbers,
  stringsInWords,
  stringsWeDontPlayInWords,
  phrasesForExitSkill,
  audioIds,
  imgIds,
  tellCorrectNumberPhrases,
  tellStringPhrases,
  helpMePhrases
} = require("./constants");

module.exports.handler = async (event) => {

  const {request, session, version, meta} = event;
  const tokens = request.nlu.tokens;
  const randomNumber = getRandomNumber(0, tellStringPhrases.length - 1);

  let response = {end_session: false};
  let userStringNumber;
  let responseIfWrongUserRequest = tellStringPhrases[randomNumber].title;
  let responseTTSIfWrongUserRequest = tellStringPhrases[randomNumber].tts;

  // different ways to detect string number
  if (!session.new && request.original_utterance !== 'ping') {
    const entities = request.nlu.entities;
    if (entities.length === 1 && entities[0].type === 'YANDEX.NUMBER') {
      if (stringsNumbers.includes(entities[0].value)) {
        userStringNumber = entities[0].value
      } else {
        const randomNumber = getRandomNumber(0, tellCorrectNumberPhrases.length - 1);
        responseIfWrongUserRequest = tellCorrectNumberPhrases[randomNumber].title;
        responseTTSIfWrongUserRequest = tellCorrectNumberPhrases[randomNumber].tts;
      }
    } else {
      stringsNumbers.some((stringNumber) => {
        if (tokens.some((token) => stringsInWords[stringNumber].includes(token))) {
          userStringNumber = stringNumber;
          return true
        }
      });
    }
  }

  // basic case, when user tells correct string
  if (userStringNumber) {
    response.tts = `<speaker audio="dialogs-upload/${skillId}/${audioIds[userStringNumber]}.opus">`;
    response.text = `Играю струну номер ${userStringNumber}`;
    response.buttons = getButtons();
    if (meta && meta.interfaces && meta.interfaces.screen) setImgForResponse(userStringNumber)

    // cases where user tells incorrect/ambiguous string or ask another question
  } else if (stringsWeDontPlayInWords.some((string) => request.original_utterance.includes(string))) {
    response.text = 'Такую ноту сыграть не могу. Могу сыграть только ми, си, соль, ре и ля';
    response.buttons = getButtons();
  } else if (tokens.includes('ми')) {
    response.text = 'На гитаре есть 2 струны "ми": первая и шестая. Какую сыграть?';
    response.tts = 'На гитаре есть две струн+ы ми - - - первая и шестая. Какую сыграть';
    response.buttons = getButtons([1, 6]);
  } else if (tokens.includes('кто')) {
    response.text = 'Новицкас Станислав';
    response.tts = 'Нов+итскас Станислав'
    response.buttons = getButtons();
  } else if (tokens.includes('стоп')) {
    response.text = 'Окей. Скажите хватит, если хотите выйти из навыка. Либо назовите струну, если хотите продолжить настраивать гитару';
    response.tts = 'Окей. Скажите хватит, если хотите выйти из навыка. Либо назовите струн+у, если хотите продолжить настраивать гитару';
    response.buttons = getButtons();
  } else if (helpMePhrases.some((helpPhrase) => request.original_utterance.includes(helpPhrase))) {
    response.text = 'Помогу настроить шестиструнную гитару в стандартном строе. Назовите номер струны и я её сыграю. Первая струна — самая тонкая';
    response.tts = 'Помогу настроить шестиструнную гитару в стандартном строе. Назовите номер струн+ы и я её сыграю. Первая струна самая тонкая';
    response.buttons = getButtons();
  } else if (phrasesForExitSkill.some((stopPhrase) => request.original_utterance.includes(stopPhrase))) {
    response.text = 'До свидания';
    response.end_session = true;
  } else {
    response.text = responseIfWrongUserRequest;
    response.buttons = getButtons();
    if (responseTTSIfWrongUserRequest) response.tts = responseTTSIfWrongUserRequest;
    if (meta && meta.interfaces && meta.interfaces.screen) setImgForResponse(0)
  }

  function getButtons(numberList = stringsNumbers) {
    let buttons = [];
    numberList.forEach((buttonNumber) => {
      buttons.push({title: buttonNumber.toString(), hide: true})
    });
    buttons.push({title: 'помощь', hide: true});
    return buttons
  }

  function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function setImgForResponse(stringNumber) {
    response.card = {
      type: 'BigImage',
      image_id: imgIds[stringNumber],
      title: response.text
    }
  }

  return {version, session, response}
};
