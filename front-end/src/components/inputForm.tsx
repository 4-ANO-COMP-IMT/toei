import React from "react";

interface InputFormProps {
    label: string;
    type: string;
    id: string;
    onChange?: React.FormEventHandler<HTMLInputElement>;
}

function InputForm(props: InputFormProps) {
  return (
    <div>
        <label style={{display:"block"}}>{props.label}</label>
      <input id={props.id} type={props.type}  onChange={props.onChange}/>
    </div>
  )
}

export default InputForm