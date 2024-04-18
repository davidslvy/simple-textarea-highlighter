function textareaColorizeFunc(textareaObj, highlightChars) {
  // Obtener el texto del textarea
  let text = $(textareaObj).text();
  // Obtener la selección actual
  let sel = window.getSelection();
  // Obtener el nodo de anclaje de la selección
  let selectionAnchorNode = sel.anchorNode;
  // Verificar si el nodo de anclaje no es directamente el textarea
  if (!selectionAnchorNode.parentNode.isSameNode(textareaObj)) {
    // Si no es el textarea, asignar el nodo padre como el nodo de anclaje
    selectionAnchorNode = selectionAnchorNode.parentNode;
  }
  // Obtener el desplazamiento del anclaje de la selección
  let selectionAnchorOffset = sel.anchorOffset;
  // Obtener todos los nodos secundarios del textarea
  let nowChildNodes = textareaObj.childNodes;
  // Calcular la longitud del desplazamiento actual
  let offsetLength = 0;
  for (tmpNode of nowChildNodes) {
    // Detenerse si se alcanza el nodo de anclaje
    if (tmpNode.isSameNode(selectionAnchorNode)) {
      break;
    }
    // Calcular la longitud total de los nodos secundarios
    let tmpNodeLength = $(tmpNode).text().length;
    offsetLength += tmpNodeLength;
  }
  offsetLength += selectionAnchorOffset;

  // Variables para mantener el índice y el desplazamiento del nodo actual
  let nodeIndex = 0;
  let nodeOffset = 0;
  // Variable para rastrear si estamos dentro de un nodo resaltado
  let ifInNode = false;
  for (let i = 0; i < offsetLength; i++) {
    let tmpChar = text[i];
    // Iterar sobre los caracteres resaltados
    for (let highlightChar in highlightChars) {
      if (tmpChar == highlightChar && i < text.length - 1) {
        // Ajustar el índice y el desplazamiento según sea necesario
        if (i == 0) {
          nodeIndex -= 1;
        }
        let ifAddFlag = false;
        if (!ifInNode && text.substring(i + 1).includes(highlightChar)) {
          ifInNode = true;
          ifAddFlag = true;
          nodeOffset = 0;
        } else if (ifInNode) {
          ifInNode = false;
          ifAddFlag = true;
          nodeOffset = -1;
        } else {
          ifAddFlag = false;
        }
        if (ifAddFlag) {
          nodeIndex += 1;
          break;
        }
      }
    }
    nodeOffset += 1;
  }

  // Resaltar los caracteres especificados en el texto
  for (let highlightChar in highlightChars) {
    text = colorizeText(text, highlightChar, highlightChars[highlightChar]);
  }
  // Establecer el contenido HTML modificado en el textarea
  textareaObj.innerHTML = text;

  // Crear un nuevo rango de selección y establecerlo en el nodo actual
  let newRange = document.createRange();
  let rangeInNode = textareaObj.childNodes[nodeIndex];
  try {
    // Manejar el caso en el que el nodo de rango no esté definido
    if (typeof rangeInNode === "undefined") {
      rangeInNode = textareaObj.firstChild;
    }
    // Manejar el caso en el que el nodo de rango sea un elemento
    if (rangeInNode.nodeType == 1) {
      rangeInNode = rangeInNode.firstChild;
    }
    // Establecer el rango de inicio y fin en el nodo actual
    newRange.setStart(rangeInNode, nodeOffset);
    newRange.setEnd(rangeInNode, nodeOffset);
    // Limpiar todas las selecciones existentes y agregar el nuevo rango
    sel.removeAllRanges();
    sel.addRange(newRange);
  } catch (error) {
    // En caso de error, enfocar el textarea
    $(textareaObj).focus();
  }
}

// Función para resaltar el texto especificado con el color dado
function colorizeText(oriText, highlightChar, highlightColor) {
  let tmpSplitArr = oriText.split(highlightChar);
  let solvedCount = Math.floor((tmpSplitArr.length - 1) / 2);
  let startItemAddStr = "<span style=\"color: " + highlightColor + ";\">";
  let endItemAddStr = "</span>"
  for (let index = 0; index < solvedCount; index++) {
    if (!tmpSplitArr[index * 2].endsWith(startItemAddStr)) {
      tmpSplitArr[index * 2] = tmpSplitArr[index * 2] + startItemAddStr;
    }
    if (!tmpSplitArr[(index + 1) * 2].startsWith(endItemAddStr)) {
      tmpSplitArr[(index + 1) * 2] = endItemAddStr + tmpSplitArr[(index + 1) * 2];
    }
  }
  let finalStr = tmpSplitArr.join(highlightChar);
  return finalStr;
}
