const skillId = 'c582ae95-f5df-48cc-bbf3-a9ce540a8931';
const stringsNumbers = [6, 5, 4, 3, 2, 1];
const stringsInWords = {
  1: ['тонкая', 'нижняя', 'ми первой октавы', 'me', 'mi'],
  2: ['си', 'b', 'б', 'би', 'si', 'se'],
  3: ['соль', 'g', 'джи'],
  4: ['ре', 'рэ', 'd', 'дэ', 're'],
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

const imgIds = {
  0: '1030494/7a5bbf5a10bd4d0af475', // no active strings
  1: '997614/72a5f790369d3d459ed7', // first string active
  2: '213044/7d8cccdaf95f08517da9',
  3: '1533899/38ce9eec7023900c6420',
  4: '1030494/f0daf1c6741aba42fe03',
  5: '1521359/786f023983b5f884dd08',
  6: '1656841/3e0c0db6418999e9670a',
};
const tellCorrectNumberPhrases = [
  {title: 'На моей гитаре всего 6 струн. Назовите число от одного до шести', tts: 'На моей гитаре всего шесть струн. Назовите число от одного до шести'},
  {title: 'Такой струны нет. Назовите номер струны от одного до шести', tts: 'Такой струны нет. Назовите номер струн+ы от одного до шести'},
  {title: 'Струны с таким номером нет. Назовите число от одного до шести', tts: 'Струн+ы с таким номером нет. Назовите число от одного до шести'}];
const tellStringPhrases = [
  {title: 'Назовите струну и я её сыграю', tts: 'Назовите струн+у и я её сыграю'},
  {title: 'Назовите номер струны от одного до шести', tts: 'Назовите номер струн+ы от одного до шести'},
  {title: 'Назовите номер струны или ноту', tts: 'Назовите номер струн+ы или ноту'}];
const helpMePhrases = ['помощь', 'что ты умеешь'];

module.exports = {
  skillId,
  stringsNumbers,
  stringsInWords,
  stringsWeDontPlayInWords,
  phrasesForExitSkill,
  audioIds,
  imgIds,
  tellCorrectNumberPhrases,
  tellStringPhrases,
  helpMePhrases}
