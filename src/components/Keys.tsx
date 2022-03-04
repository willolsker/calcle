import Key from "./Key";

function Keys() {
    return <>
        <Key input="x" column={1} row={1}/>
        <Key input="@" column={2} row={1}/>
        <Key input="<" column={1} row={2}/>
        <Key input=">" column={2} row={2}/>
        <Key input="[" column={1} row={3}/>
        <Key input="]" column={2} row={3}/>
        <Key input="+" column={1} row={4}/>
        <Key input="-" column={2} row={4}/>

        <Key input="0" column={4} row={1}/>
        <Key input="1" column={5} row={1}/>
        <Key input="2" column={6} row={1}/>
        <Key input="3" column={7} row={1}/>
        <Key input="4" column={8} row={1}/>
        <Key input="5" column={4} row={2}/>
        <Key input="6" column={5} row={2}/>
        <Key input="7" column={6} row={2}/>
        <Key input="8" column={7} row={2}/>
        <Key input="9" column={8} row={2}/>
    </>
}

export default Keys;