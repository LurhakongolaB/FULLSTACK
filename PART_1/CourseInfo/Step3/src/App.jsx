
const Header = (props) => { console.log("props passed",props)
  return <h1>{props.course}</h1>
}
const Part = (props) => {
  console.log('part received', props)
  return <p> {props.name} {props.exercises}</p>
  }
const Content = (props) => {
  console.log('content received these parts:', props)
  return (
    <div>
      <Part name={props.part1.name} exercises={props.part1.exercises}/>
      console.log('now redering part 2');
      <Part name={props.part2.name} exercises={props.part2.exercises}/>
      <Part name={props.part3.name} exercises={props.part3.exercises}/>
    </div>
  );
    
}
const Total = (props) => {
  console.log("Total received", props)
  return (
      <p>
        Number of exercises {props.sum}
      </p>
  );
}



const App=() =>{
  const course = 'Half Stack application development'
  const part1 = {
    name:'Fundamentals of React',
    exercises:10
  }
  const part2={
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3={
    name: 'State of a component',
    exercises: 14
  }
  

  return(
    <div>
      <Header course={course}/>
      <Content part1={part1} part2={part2}
      part3={part3} />
      <Total sum={part1.exercises+part2.exercises+part3.exercises}/>
    </div>
  )
}

export default App