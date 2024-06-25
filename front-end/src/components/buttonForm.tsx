interface buttonFormProps {
    text: string
}

function buttonForm(props: buttonFormProps) {
    return (
      <button form="submit">{props.text}</button>
    )
  }
  
  export default buttonForm