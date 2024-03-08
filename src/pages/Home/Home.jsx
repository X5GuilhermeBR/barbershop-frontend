import logo from '../../assets/logo.png';
import Button from '../../components/Button/Button';
import CenteredDivStyled from './SignInStyled';

function Home() {
  return (
    <CenteredDivStyled>
      <div>
        <img src={logo} alt="Logo" width="100%" />
        <Button backgroundColor="#efb810" width="100%">
          LOGIN
        </Button>
        <Button borderColor="#efb810" color="white" width="100%">
          CADASTRAR
        </Button>
      </div>
    </CenteredDivStyled>
  );
}

export default Home;
