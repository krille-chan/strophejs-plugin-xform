# Jsonize

Working with xml in javascript is not funny. In the most cases you want to convert it to json and want all the informationen on the top i.e. when you are working with strophe.js and XMPP.

Jsonize converts your XML document into one pure json-object, following this rules:

1. All attributes from the root get elements in the object
2. All attributes from the first level children get elements in the object with the suffix CHILDRENTAGNAME\_
3. When there are multiple children with the same name, it will create an array
4. Continue recursive

In the most cases, this could be a simple and fast solution.
