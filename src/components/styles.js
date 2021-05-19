import { makeStyles } from '@material-ui/styles';

const colors = [
  '#FD8FA3',
  '#95A8FC',
  '#55EDCA',
  '#FDA367',
  '#5ED8FA'
];

const createClasses = () => {

  const map = {};

  for(let i = 0; i < colors.length; i++) {
    const key = `color-${i}`;
    const propKeyBgColor = `${key}-bgColor`;
    map[propKeyBgColor] = {
      backgroundColor: colors[i]
    }

    const propKeyBorderColor = `${key}-border`;
    map[propKeyBorderColor] = {
      backgroundColor: `1px solid ${colors[i]}`
    }
  }
  return map;
}

export default makeStyles(() => (
  {
    ...{
      imageIcon: {
      height: 110,
      },
      avatarIcon: {
        // color: '#FFED94',
        backgroundColor: '#E5E5E5',
        border: '4px solid #FFED94',
        color: 'aqua',
        fontSize: '1rem'
      }
      
    }, ...createClasses()
  }
));
