interface InputFormProps {
    label: string;
    type: string;
}

function InputForm(props: InputFormProps) {
  return (
    <div>
        <label style={{display:"block"}}>{props.label}</label>
        <input type={props.type} />
    </div>
  )
}

export default InputForm