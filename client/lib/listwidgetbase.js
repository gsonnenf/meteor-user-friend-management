/**
 * Created by Greg on 7/8/2016.
 */

export class ListWidgetBase{
    constructor() {
        this.itemElementList = [];
    }

    initialize(containerName,collection,adapter) {
        if (containerName) this.containerElement = $('#'+containerName);
        if (collection) this.bindCollection(collection, this.adapter);
    }
    
    bindCollection(collection, adapter ){
        this.cursor = collection.find();
        this.observeHandle = this.cursor.observe({
            added: (doc)=>{ this.addElement(adapter(doc) ); },
            removed: (doc)=>{ this.removeElement( adapter(doc) ); }
        })
    }

    errorResultCallback(error,result) {
        if (error) throw error;
        if (result) console.log("Result:" + result);
    }
    
    getSelected() {
        var selected = this.containerElement.find(":selected")
        if (!selected) throw new Error("No item selected");
        var name = selected.text();
        var id = selected.val();
        if (!name) throw new Error("Name is blank.");
        if (!id) throw new Error("Id is blank.");
        return {label:name, id: id};
    }

    addElement( item ) {
        var element = this.createElement( item );
        this.itemElementList.push({element:element, item:item });
        this.containerElement.append(element);
    }

    removeElement( item ) {
        var index = this.itemElementList.findIndex( (itemElement)=>{ return itemElement.item.id == item.id });
        if (index == -1) throw Error('remove element index not found');
        var elementObject = this.itemElementList.splice(index,1).pop();
        $(elementObject.element).remove();
    }

    createElement( item ) {
        return $("<option value='" + item.id + "'>" + item.label + "</option>");
        //throw new Error("Abstract Method:createElement Called. This method must be over-ridden when inheriting from ListWidgetBase");
    }

    adapter(){
        throw new Error("Abstract adapter should be over-ridden");
    }



}