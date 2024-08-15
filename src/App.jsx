import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const initialTodos = JSON.parse(localStorage.getItem('todo')) ||  [
  {
    id: 1,
    text: 'Aprender React'
  },
  {
    id: 2,
    text: 'Aprender js'
  },
  {
    id: 3,
    text: 'Aprender vuejs'
  }
]
const App = () => {

  const [todo, setTodo] = useState(initialTodos);

  useEffect(() => {

    localStorage.setItem('todo', JSON.stringify(todo));
  }, [todo])

  //creamos un handled dragend para modificar el resultado del dragdropcontext que es la funcion de arrastrar items y que queden donde los dejo el usuario
  const handleDragEnd = (result) => {
    
    //usamos el if para que cuando arrastramos un item hacia afuera y nos devuelva null devuelva el return (el destination es donde va a quedar el item que arrastro el usuario
    // en este caso si lo arrastro hacia afuera quedaria null por ende deberia salir de la funcion para que no haya ningun cambio y la app no se rompa)
    if(!result.destination){
      return
    }
    //sacamos el starIndex del item oara luego usar el index inicial en el metodo splice
    const startIndex = result.source.index;
    //sacamos el index final donde quedara el objeto que el usuario movio , el inicial es donde estaba inicialmente el objeto que el usuario arrastro
    const endIndex = result.destination.index;

    //usamos una copia del array de objetos original ya que el splice modifica el objeto o array original
    const copyarray = [...todo];
    // desestructuramos el arreglo para sacar el objeto que esta dentro del arreglo en este caso con el splice estamos sacando 1 objeto del index inicial ( el star index es el index 
    //de donde estamos sacando el objeto, el 1 indica que sacaremos 1 objeto a partir del indice inicial en este caso seria el objeto que esta en el indice inicial)
    const [reorderItem] = copyarray.splice(startIndex, 1);
    //luego con el  corrpy array que ahora no tendra el objeto que sacamos del starindex usando el splice le pasamos el indice final que es donde el usuario dejo el objeto arrastrado
    // usamos el 0 para decirle al splice que no borrara nada , luego le pasamos el item que habiamos sacado del copy array para agregarlo en el indice final ( el indice de endIndex)
    copyarray.splice(endIndex, 0, reorderItem );
    //con setodo le pasamos el copy array para actualizar el todo 
    setTodo(copyarray);
  }


  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <h1>Todo App</h1>
        <Droppable droppableId='todos'>
          {
            (droppableProvide) => (
              <ul ref={droppableProvide.innerRef} {...droppableProvide.droppableProps}>
                {
                  todo.map((items, index) => (
                    <Draggable index={index} key={items.id} draggableId={`${items.id}`}>

                      {
                        (draggableProvider) => (
                          <li ref={draggableProvider.innerRef} {...draggableProvider.dragHandleProps} {...draggableProvider.draggableProps}>
                            {items.text}
                          </li>
                        )
                      }

                    </Draggable>
                  ))
                }
                {droppableProvide.placeholder}
              </ul>
            )
          }

        </Droppable>
      </DragDropContext>
    </div>
  )
}

export default App