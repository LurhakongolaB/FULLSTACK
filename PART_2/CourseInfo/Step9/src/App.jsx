
const Header = ({ name }) => {
  console.log('Header props:', name)
  return <h2>{name}</h2>
}

const Part = ({ part }) => {
  console.log('Part props:', part)
  return <p>{part.name} {part.exercises}</p>
}

const Content = ({ parts }) => {
  console.log('Content props (array):', parts)
  return (
    <div>
      {parts.map(part => 
        <Part key={part.id} part={part} />
      )}
    </div>
  )
}

const Total = ({ parts }) => {
  console.log('Total is calculating for these parts:', parts)
  
  const total = parts.reduce((s, p) => {
    console.log('What is happening in reduce:', s, p)
    return s + p.exercises
  }, 0)

  return <b>total of {total} exercises</b>
}

const Course = ({ course }) => {
  console.log('Course component received:', course)
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        { name: 'Fundamentals of React', exercises: 10, id: 1 },
        { name: 'Using props to pass data', exercises: 7, id: 2 },
        { name: 'State of a component', exercises: 14, id: 3 },
        { name: 'Redux', exercises: 11, id: 4 }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        { name: 'Routing', exercises: 3, id: 1 },
        { name: 'Middlewares', exercises: 7, id: 2 }
      ]
    }
  ]

  return (
    <div>
      <h1>Web development curriculum</h1>
      {courses.map(course => 
        <Course key={course.id} course={course} />
      )}
    </div>
  )
}

export default App