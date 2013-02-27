easyDragDrop
============

A simple drag'n'drop jquery extension

# changelog

  * 1.1
    * Fixed: now works with newest jQuery versions (live deprecated).
    * Added: every callback receives a third parameter: the element that started the drag.

# usage

    $('your drag elements selector').easyDragDrop(options);
    
# options

  * **dragNode**: `<jQuery|HTMLElement|String>` the drag node to be used as a "drag element". If the given node is not present in the DOM tree, it will be appended.
  * **dragStart**: `<Function(jQuery.event,$(dragNode),$(taget))>` a function called when drag starts, the `this` inside this function refers to draggable element.
  * **dragEnd**: `<Function(jQuery.event,$(dragNode),$(taget))>` a function called when drag ends, the `this` inside this function refers to draggable element. This function will be called after `target.drop`.
  * **targetSet**: `<Array<Object>>` the possible drop targets for this draggable element.
  * **targetSet.target**: `<jQuery|HTMLElement|String>` some droppable area for this draggable element.
  * **targetSet.targetEnter**: `<Function(jQuery.event,$(dragNode),$(taget))>` a function called when the draggable element enters the droppable area, the `this` inside this function refers to droppable element.
  * **targetSet.targetLeave**: `<Function(jQuery.event,$(dragNode),$(taget))>` a function called when the draggable element leaves the droppable area, the `this` inside this function refers to droppable element.
  * **targetSet.drop**: `<Function(jQuery.event,$(dragNode),$(taget))>` a function called when the user drops the draggable element in this area, the function given as `targetSet.targetLeave` also is called this momment. the `this` inside this function refers to droppable element.

# important notes

  * This plugin has not the "`position:relative` parent bug", like the draggable extension on jQuery-UI. It works with `position:fixed` only.
  * With this code you don't drag the draggable element itself, you drag around a given HTMLNode. But if you need this behavior, you can move the draggable element to the "dragNode" on the "dragStart" event. Note that in every method passed to this extension you can acess the "dragNode".
  * When the `dragNode` is being dragged around, it have the `.is-dragging` css class on it.