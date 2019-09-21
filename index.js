// Для асинхронной работы используется пакет micro.
const { json } = require('micro');

// Запуск асинхронного сервиса.
module.exports = async (req, res) => {

    // Из запроса извлекаются свойства request, session и version.
  const { request, session, version } = await json(req);
  const skillId = 'c582ae95-f5df-48cc-bbf3-a9ce540a8931';
  const stringsNumbers = [1, 2, 3, 4, 5, 6];
  const tokens = request.nlu.tokens;
  const stringsInWords = {
    1: ['тонкая', 'нижняя', 'ми первой октавы'],
    2: ['си', 'b', 'б', 'би'],
    3: ['соль', 'g', 'джи'],
    4: ['ре', 'рэ', 'd', 'дэ'],
    5: ['ля', 'a', 'а'],
    6: ['толстая', 'верхняя', 'ми большой октавы', 'e', 'йе'],
  };
  const audioIds = {
    1: '5f338760-dfd5-47c1-9ee0-8fd160bbc399',
    2: 'b36ae01e-5c72-49e7-b3dd-889889875830',
    3: '076f3ed1-a913-4f88-a18f-2020daf18bc4',
    4: '5d3b1e61-c5b1-4719-87b4-bb375cc6a79b',
    5: '7bbb29d2-aca2-4c47-bc62-b2be77a68f38',
    6: 'b4be4e3f-b464-4757-bf95-2edd1b4008c6',
  };
  const userStringNumber = getStringNumber(request);
  let responseIfWrongUserRequest = 'Назовите струну и я её сыграю';
    function getStringNumber (request) {
      if (session.new || request.original_utterance === 'ping') return null;
      const entities = request.nlu.entities;
      if (entities.length === 1 && entities[0].type === 'YANDEX.NUMBER') {
        if (stringsNumbers.includes(entities[0].value)) {
          return entities[0].value
        } else {
          responseIfWrongUserRequest = 'Назовите число от одного до шести';
          return null
        }
      }
      let userStringNumberGuessedFromWords;
      stringsNumbers.some((stringNumber) => {
        if (tokens.some((token) => stringsInWords[stringNumber].includes(token))){
          userStringNumberGuessedFromWords = stringNumber;
          return true
        }
      });
      return userStringNumberGuessedFromWords
    }
    let response = {end_session: false};
    if (userStringNumber) {
      response.tts = `<speaker audio="dialogs-upload/${skillId}/${audioIds[userStringNumber]}.opus">`;
      response.text = `Играю струну номер ${userStringNumber}`;
    } else {
      response.text = tokens.includes('кто') ? 'Новицкас Станислав' : responseIfWrongUserRequest;
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
