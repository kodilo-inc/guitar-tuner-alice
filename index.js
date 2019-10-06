// Для асинхронной работы используется пакет micro.
const { json } = require('micro');

// Запуск асинхронного сервиса.
module.exports = async (req, res) => {

  const { request, session, version } = await json(req);
  const skillId = 'c582ae95-f5df-48cc-bbf3-a9ce540a8931';
  const stringsNumbers = [6, 5, 4, 3, 2, 1];
  const tokens = request.nlu.tokens;
  const stringsInWords = {
    1: ['тонкая', 'нижняя', 'ми первой октавы'],
    2: ['си', 'b', 'б', 'би'],
    3: ['соль', 'g', 'джи'],
    4: ['ре', 'рэ', 'd', 'дэ'],
    5: ['ля', 'a', 'а'],
    6: ['толстая', 'верхняя', 'ми большой октавы', 'e', 'йе'],
  };
  const stringsWeDontPlayInWords = ['до', 'фа'];
  const phrasesForExitSkill = ['выйди', 'выключи навык'];
  const audioIds = {
    1: '5f338760-dfd5-47c1-9ee0-8fd160bbc399',
    2: 'b36ae01e-5c72-49e7-b3dd-889889875830',
    3: '076f3ed1-a913-4f88-a18f-2020daf18bc4',
    4: '5d3b1e61-c5b1-4719-87b4-bb375cc6a79b',
    5: '7bbb29d2-aca2-4c47-bc62-b2be77a68f38',
    6: 'b4be4e3f-b464-4757-bf95-2edd1b4008c6',
  };
  const telCorrectNumberPhrases = [
    {title: 'На моей гитаре всего 6 струн. Назовите число от одного до шести', tts: 'На моей гитаре всего шесть струн. Назовите число от одного до шести'},
    {title: 'Такой струны нет. Назовите номер струны от одного до шести', tts: 'Такой струны нет. Назовите номер струн+ы от одного до шести'},
    {title: 'Струны с таким номером нет. Назовите число от одного до шести', tts: 'Струн+ы с таким номером нет. Назовите число от одного до шести'}];
  const telStringPhrases = [
    {title: 'Назовите струну и я её сыграю', tts: 'Назовите струн+у и я её сыграю'},
    {title: 'Назовите номер струны от одного до шести', tts: 'Назовите номер струн+ы от одного до шести'},
    {title: 'Назовите номер струны или ноту', tts: 'Назовите номер струн+ы или ноту'}];
  const helpMePhrases = ['помощь', 'что ты умеешь'];
  const randomNumber = getRandomNumber(0, telStringPhrases.length - 1);
  let response = {end_session: false};
  let userStringNumber;
  let responseIfWrongUserRequest = telStringPhrases[randomNumber].title;
  let responseTTSIfWrongUserRequest = telStringPhrases[randomNumber].tts;
  if (!session.new && request.original_utterance !== 'ping') {
    const entities = request.nlu.entities;
    if (entities.length === 1 && entities[0].type === 'YANDEX.NUMBER') {
      if (stringsNumbers.includes(entities[0].value)) {
        userStringNumber = entities[0].value
      } else {
        const randomNumber = getRandomNumber(0, telCorrectNumberPhrases.length - 1);
        responseIfWrongUserRequest = telCorrectNumberPhrases[randomNumber].title;
        responseTTSIfWrongUserRequest = telCorrectNumberPhrases[randomNumber].tts;
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

  if (userStringNumber) {
    response.tts = `<speaker audio="dialogs-upload/${skillId}/${audioIds[userStringNumber]}.opus">`;
    response.text = `Играю струну номер ${userStringNumber}`;
  } else if (stringsWeDontPlayInWords.some((string) => request.original_utterance.includes(string))) {
    response.text = 'Такую ноту сыграть не могу. Могу сыграть только ми, си, соль, ре и ля';
  } else if (tokens.includes('ми')) {
    response.text = 'На гитаре есть 2 струны "ми": первая и шестая. Какую сыграть?';
    response.tts = 'На гитаре есть две струн+ы ми - - - первая и шестая. Какую сыграть';
    response.buttons = getButtons([1, 6]);
  } else if (tokens.includes('кто')) {
    response.text = 'Новицкас Станислав';
    response.tts = 'Нов+итскас Станислав'
  } else if (tokens.includes('стоп')) {
    response.text = 'Окей. Скажите хватит, если хотите выйти из навыка. Либо назовите струну, если хотите продолжить настраивать гитару';
    response.tts = 'Окей. Скажите хватит, если хотите выйти из навыка. Либо назовите струн+у, если хотите продолжить настраивать гитару';
  } else if (helpMePhrases.some((helpPhrase) => request.original_utterance.includes(helpPhrase))) {
    response.text = 'Помогу настроить шестиструнную гитару в стандартном строе. Назовите струну и я её сыграю.';
    response.tts = 'Помогу настроить шестиструнную гитару в стандартном строе. Назовите струн+у и я её сыграю.';
  } else if (phrasesForExitSkill.some((stopPhrase) => request.original_utterance.includes(stopPhrase))) {
    response.text = 'До свидания';
    response.end_session = true;
  } else {
    response.text = responseIfWrongUserRequest;
    response.buttons = getButtons();
    if (responseTTSIfWrongUserRequest) response.tts = responseTTSIfWrongUserRequest
  }

  function getButtons(numberList = stringsNumbers) {
    let buttons = [];
    numberList.forEach((buttonNumber) => {
      buttons.push({title: buttonNumber.toString()})
    });
    return buttons
  }

  function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // В тело ответа вставляются свойства version и session из запроса.
  // Подробнее о формате запроса и ответа — в разделе Протокол работы навыка.
  res.end(JSON.stringify(
      {
          version,
          session,
          response,
      }
  ));
};
