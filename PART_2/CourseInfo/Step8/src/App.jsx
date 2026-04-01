const Header =({course})=>{
  console.log(course)
  return (
    <h1>{course}</h1>
)
}

const Part = ({part})=>{
  console.log('Part proparties:', part)
  return(
    <p>
    {part.name} {part.exercises}
    </p>

  )
}

const Content = ({parts})=>{
  console.log('Content props:', parts )
  return(
    <div>
      {parts.map(part =>
        <Part key={part.id} part={part}/>
      )}
    </div>  
    )
}


const Total = ({parts})=>{
  console.log('Total props:', parts)
  const totalAmount = parts.reduce((s, p)=> {
    console.log('What is hapening', s,p)
    
      return s+ p.exercises
    }, 0)

  return (
    <p><b>total of {totalAmount} exercises</b></p> 
  )
}

const Course = ({course})=>{
  return (
    <div>
         <Header course={course.name}/>
         <Content parts={course.parts}/>
         <Total parts={course.parts}/>
    </div>
  )
}
const App = ()=> {
  console.log("use your moment")
  const course ={
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass deata',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a componnent',
        exercises: 14,
        id: 3
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4
      }
    ]
  }
  return <Course course={course}/>
}
export default App