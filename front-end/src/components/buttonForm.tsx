interface buttonFormProps {
    text: string;
    type: "submit" | "reset" | "button" | undefined;
}

function buttonForm(props: buttonFormProps) {
    return (
      <button type={props.type}>{props.text}</button>
    )
}

export default buttonForm