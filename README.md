#Xform

This is an unofficial Strophe.js plugin to help you working with xforms. You can convert xml forms to html forms and back. Also you can transfer any xml document into json with the function **jsonize**.

### Jsonize

Working with xml in javascript is not funny. In the most cases you want to convert it to json and want all the informationen on the top i.e. when you are working with strophe.js and XMPP.

Jsonize converts your XML document into one pure json-object, following this rules:

1. All attributes from the root become elements in the object
2. All attributes from the first level children get elements in the object with the suffix CHILDRENTAGNAME\_
3. If there are multiple children with the same name, it will create an array
4. If there are no children, check for a text node and make this an attribute called "text"
4. Continue recursive

In the most cases, this could be a simple and fast solution.
