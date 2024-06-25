import InputForm from '../components/inputForm'
import ButtonForm from '../components/buttonForm'
import './createUserPage.css'

function CreateUserPage() {
  return (
    <div>
      <h1>Create User</h1>
      <form action="" className='form'>
      <InputForm label="Name" type="text" />
      <InputForm label="BirthDate" type="date" />
      <InputForm label="Username" type="text" />
      <InputForm label="Email" type="email" />
      <InputForm label="Password" type="password" />
      <InputForm label="Confirm password " type="password" />
      <ButtonForm text={"Register"}/>
      </form>
    </div>
  )
}

export default CreateUserPage