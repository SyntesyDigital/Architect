import React, {Component} from 'react';
import { render } from 'react-dom';

import TextField from './../ContentFields/TextField';
import SlugField from './../ContentFields/SlugField';

import FirstEmptyRow from './RowTypes/FirstEmptyRow';
import Row from './RowTypes/Row';

import ModalSelectItem from './ModalSelectItem';
import ModalEditItem from './ModalEditItem';
import ModalEditClass from './ModalEditClass';
import MediaSelectModal from './../../Medias/MediaSelectModal';
import ContentSelectModal from './../ContentSelectModal';


class PageBuilder extends Component {

  constructor(props){
    super(props);

    this.state = {
        fields : [],
        errors : props.errors,

        /*
        layout : this.props.layout ? this.props.layout : [
          {
            type : 'row',
            children : [
              {
                type : 'col',
                colClass : 'col-xs-12'
              }
            ]
          }
        ],
        */

        displayItemModal : false,
        displayClassModal : false,
        displayEditItemModal : false,
        displayMediaModal: false,
        displayContentModal: false,
        displayClassModal: false,

        pathToIndex : null,
        editItemData : null,
        addPosition : null,
        listItemIndex : -1,
        mediaType : null,
        contentField : null,
        imageCallback : null,
        contentCallback : null,

    };

    this.handleAddRow = this.handleAddRow.bind(this);
    this.handleDeleteRow = this.handleDeleteRow.bind(this);
    this.handleColTypeSelected = this.handleColTypeSelected.bind(this);
    this.handleColChanged = this.handleColChanged.bind(this);
    this.handleItemSelect = this.handleItemSelect.bind(this);
    this.handleItemCancel = this.handleItemCancel.bind(this);
    this.handleItemSelected = this.handleItemSelected.bind(this);
    this.handleContentSelect = this.handleContentSelect.bind(this);
    this.handleContentSelected = this.handleContentSelected.bind(this);
    this.handleContentCancel = this.handleContentCancel.bind(this);


  }

  /*
  componentDidMount() {

    if(this.props.layout == null){
      this.setFirstRow();
    }
  }
  */

  componentWillReceiveProps(nextProps) {

    console.log("PageBuilder :: componentWillRecieveProps => ",nextProps);

    if(nextProps.layout != null){

      //a change has been done to layout
      if(!this.state.displayEditItemModal){
        //if the modal is not displaying, don't close the modal yet

        this.setState({
          displayItemModal : false,
          displayClassModal : false,
          displayEditItemModal : false,
          displayContentModal : false,
          contentField : null,
          pathToIndex : null,
          addPosition : null,
          editItemData : null,
          addPosition : null,
          contentCallback : null,
          errors : nextProps.errors
        });

        return;
      }
    }

    this.setState({
      errors : nextProps.errors
    });
  }

  /******** Modal Items  ********/

  handleItemSelect(pathToIndex) {

    console.log("PageBuilder :: handleItemSelect ",pathToIndex);

    this.setState({
      displayItemModal : true,
      pathToIndex : pathToIndex
    });

  }

  handleSelectItemBefore(pathToIndex) {

    console.log("PageBuilder :: handleSelectItemBefore ",pathToIndex);

    this.setState({
      displayItemModal : true,
      pathToIndex : pathToIndex,
      addPosition : "before"
    });

  }

  handleItemCancel(){
    this.setState({
      displayItemModal : false,
      pathToIndex : null,
      addPosition : null
    });
  }

  handleItemSelected(item){

    console.log("handleItemSelected => ", item);

    var layout = this.props.layout;

    if(this.state.addPosition != null && this.state.addPosition == "before"){
      //put object to the begining
      layout = this.changeRow(layout,-1,this.state.pathToIndex,item,true);
    }
    else {
      //start array with this object
      layout = this.changeRow(layout,-1,this.state.pathToIndex,item);
    }

    console.log("layout final  => ",layout);


    this.setState({
      displayItemModal : false,
      pathToIndex : null,
      addPosition : null
    });


    this.props.updateLayout(layout);

  }

  /******** Modal Edit Class  ********/

  handleItemClassSelect(item) {

    console.log("PageBuilder :: handleItemClassSelect ",item);

    this.setState({
      displayClassModal : true,
      editItemData : item
    });

  }

  handleItemClassCancel(){
    this.setState({
      displayClassModal : false,
      editItemData : null
    });
  }

  handleItemClassSelected(field){

    console.log("handleItemClassSelected => ", field);

    var layout = this.props.layout;

    layout = this.changeRowColWithCallback(layout,-1,field.pathToIndex,field.data,
      function(field,data){

          console.log("changeRowColWithCallback :: ",field,data);

         field.settings = data.settings;
         return field;
      }
    );

    console.log("layout final  => ",layout);


    this.setState({
      displayClassModal : false,
      editItemData : null
    });


    this.props.updateLayout(layout);

  }


  /****************/

  exploteToObject(fields) {

    if(fields == null){
      return null;
    }

    var result = {};

    for(var i=0;i<fields.length;i++){
      result[fields[i]] = null;
    }
    return result;
  }


  handleAddRow(e) {

    e.preventDefault();

    var {layout} = this.props;

    if(layout == undefined || layout == null){
      layout = [];
    }

    layout.push({
        type : 'row',
        settings : this.exploteToObject(ROW_SETTINGS),
        children : [
          {
            type : 'col',
            settings : this.exploteToObject(COL_SETTINGS),
            colClass : 'col-xs-12',
            children : []
          }
        ]
      }
    );

    console.log("handleAddRow : layout : ",layout);

    this.props.updateLayout(layout);

  }

  /*
  setFirstRow() {

    var {layout} = this.props;

    if(layout == undefined || layout == null){
      layout = [];
    }

    layout.push({
        type : 'row',
        wrapper : true,
        settings : this.exploteToObject(ROW_SETTINGS),
        children : [
          {
            type : 'col',
            settings : this.exploteToObject(COL_SETTINGS),
            colClass : 'col-xs-12',
            children : []
          }
        ]
      }
    );

    this.props.updateLayout(layout);
  }
  */

  handleColTypeSelected(index,cols){

    console.log("page builder : index : "+index+", cols : "+cols);

  }

  handleColChanged(pathToIndex,data) {

    console.log("handleColChanged => ", pathToIndex, data);

    var layout = this.props.layout;

    layout = this.changeCols(layout,-1,pathToIndex,data);

    console.log("handleColChanged : layout : ",layout);

    /*
    this.setState({
      layout : layout
    });
    */

    this.props.updateLayout(layout);
  }

  changeRow(layout,currentIndex,pathToIndex,data,before){
    currentIndex++;

    if(currentIndex == pathToIndex.length -1){

      if(layout[pathToIndex[currentIndex]].children === undefined
        || layout[pathToIndex[currentIndex]].children == null){
          layout[pathToIndex[currentIndex]].children = [];
        }

        if(before !== undefined && before){
            layout[pathToIndex[currentIndex]].children.unshift(data);
        }
        else {
            layout[pathToIndex[currentIndex]].children.push(data);
        }

        return layout;
    }
    else {

      layout[pathToIndex[currentIndex]].children = this.changeRow(
        layout[pathToIndex[currentIndex]].children,
        currentIndex,
        pathToIndex,
        data,
        before
      );

      return layout;
    }
  }

  changeCols(layout,currentIndex,pathToIndex,data){
    currentIndex++;

    if(currentIndex == pathToIndex.length -1){
      layout[pathToIndex[currentIndex]].children = data;
      return layout;
    }
    else {

      layout[pathToIndex[currentIndex]].children = this.changeCols(
        layout[pathToIndex[currentIndex]].children,
        currentIndex,
        pathToIndex,
        data
      );

      return layout;
    }
  }

  /**
  *   Method to change the value of a vield by its path to Index.
  */
  changeItem(layout,currentIndex,pathToIndex,data){
    currentIndex++;

    if(currentIndex == pathToIndex.length -1){
      layout[pathToIndex[currentIndex]].field.value = data;
      return layout;
    }
    else {

      layout[pathToIndex[currentIndex]].children = this.changeItem(
        layout[pathToIndex[currentIndex]].children,
        currentIndex,
        pathToIndex,
        data
      );

      return layout;
    }
  }

  /**
  *   Method to change the content value of the link
  */
  changeItemWithCallback(layout,currentIndex,pathToIndex,data,callback){
    currentIndex++;

    if(currentIndex == pathToIndex.length -1){

      layout[pathToIndex[currentIndex]].field = callback(
        layout[pathToIndex[currentIndex]].field,data
      );
      return layout;
    }
    else {

      layout[pathToIndex[currentIndex]].children = this.changeItemWithCallback(
        layout[pathToIndex[currentIndex]].children,
        currentIndex,
        pathToIndex,
        data,
        callback
      );

      return layout;
    }
  }

  changeRowColWithCallback(layout,currentIndex,pathToIndex,data,callback){
    currentIndex++;

    if(currentIndex == pathToIndex.length -1){

      console.log("changeRowColWithCallback : row col found :: => ", layout[pathToIndex[currentIndex]]);

      layout[pathToIndex[currentIndex]] = callback(
        layout[pathToIndex[currentIndex]],data
      );
      return layout;
    }
    else {

      layout[pathToIndex[currentIndex]].children = this.changeRowColWithCallback(
        layout[pathToIndex[currentIndex]].children,
        currentIndex,
        pathToIndex,
        data,
        callback
      );

      return layout;
    }
  }

  /**
  *   Method to add a new element to a field value array. Use for images and contents.
  */
  addItem(layout,currentIndex,pathToIndex,data){
    currentIndex++;

    if(currentIndex == pathToIndex.length -1){

      if(layout[pathToIndex[currentIndex]].field.value === undefined ||
        layout[pathToIndex[currentIndex]].field.value == null){
          layout[pathToIndex[currentIndex]].field.value = [];
        }

      layout[pathToIndex[currentIndex]].field.value.push(data);
      return layout;
    }
    else {

      layout[pathToIndex[currentIndex]].children = this.addItem(
        layout[pathToIndex[currentIndex]].children,
        currentIndex,
        pathToIndex,
        data
      );

      return layout;
    }
  }

  removeItem(layout,currentIndex,pathToIndex){
    currentIndex++;

    if(currentIndex == pathToIndex.length -1){
      layout.splice([pathToIndex[currentIndex]],1);
      return layout;
    }
    else {

      layout[pathToIndex[currentIndex]].children = this.removeItem(
        layout[pathToIndex[currentIndex]].children,
        currentIndex,
        pathToIndex
      );

      return layout;
    }
  }

  changeItemChildren(layout,currentIndex,pathToIndex,callback){
    currentIndex++;

    if(currentIndex == pathToIndex.length -1){
      layout = callback(layout,pathToIndex[currentIndex]);
      return layout;
    }
    else {

      layout[pathToIndex[currentIndex]].children = this.changeItemChildren(
        layout[pathToIndex[currentIndex]].children,
        currentIndex,
        pathToIndex,
        callback
      );

      return layout;
    }
  }

  handleDeleteRow(pathToIndex) {

    console.log("handleDeleteRow => ", pathToIndex);

    var layout = this.props.layout;

    layout = this.removeItem(layout,-1,pathToIndex);

    console.log("handleDeleteRow : layout : ",layout);

    this.props.updateLayout(layout);

  }


  handleDeleteItem(item){

    var layout = this.props.layout;

    layout = this.removeItem(layout,-1,item.pathToIndex);

    this.props.updateLayout(layout);
  }

  handlePullUpItem(pathToIndex) {
    console.log("handlePullUpItem => ", pathToIndex);

    var layout = this.props.layout;

    layout = this.changeItemChildren(layout,-1,pathToIndex,function(children,index){

      if(children.length > 1 && index > 0 ){
        var temp = children[index-1];
        children[index-1] = children[index];
        children[index] = temp;
      }

      return children;
    });

    this.props.updateLayout(layout);
  }

  handlePullDownItem(pathToIndex) {
    console.log("handlePullDownItem => ", pathToIndex);

    var layout = this.props.layout;

    layout = this.changeItemChildren(layout,-1,pathToIndex,function(children,index){

      if(children.length > 1 && index < children.length-1 ){
        var temp = children[index+1];
        children[index+1] = children[index];
        children[index] = temp;
      }

      return children;
    });

    this.props.updateLayout(layout);

  }

  handleCopyItem(pathToIndex) {
    //console.log("handleCopyItem => ", pathToIndex);

    var layout = this.props.layout;

    layout = this.changeItemChildren(layout,-1,pathToIndex,function(children,index){

      var copy = jQuery.extend(true, {}, children[index]);

      if(index == children.length-1){
        //if is the last
        children.push(copy);
      }
      else {
        children.splice(index+1,0,copy);
      }

      return children;
    });

    this.props.updateLayout(layout);

  }


  handleEditItem(item){

    this.setState({
      displayEditItemModal : true,
      editItemData : item
    });

  }

  handleEditItemCancel(){

    this.setState({
      displayEditItemModal : false,
      editItemData : null
    });

  }

  renderRows() {

    const {layout} = this.props;

    return (
        layout.map((item,index) =>
          <Row
            index={index}
            key={index}
            data={item}
            childrenLength={layout.length}
            onDeleteRow={this.handleDeleteRow}
            colTypeSelect={this.handleColTypeSelected}
            onColsChanged={this.handleColChanged}
            onSelectItem={this.handleItemSelect}
            onEditItem={this.handleEditItem.bind(this)}
            onPullUpItem={this.handlePullUpItem.bind(this)}
            onPullDownItem={this.handlePullDownItem.bind(this)}
            onCopyItem={this.handleCopyItem.bind(this)}
            onDeleteItem={this.handleDeleteItem.bind(this)}
            onEditClass={this.handleItemClassSelect.bind(this)}
            pathToIndex={[parseInt(index)]}
            onSelectItemBefore={this.handleSelectItemBefore.bind(this)}
            onSelectItemAfter={this.handleItemSelect}
          />
        )
    );

  }

  handleOnEditField(field) {

    var data = field;

    //update data to pathToIndex
    console.log("handleOnEditField => ", this.state.editItemData.pathToIndex, data);

    var layout = this.props.layout;

    layout = this.changeItemWithCallback(layout,-1,this.state.editItemData.pathToIndex,data,
      function(field,newField){
         //field.value = newField.value;
         //field.settings = newField.settings;
         return newField;
      }
    );

    console.log("handleOnEditField : layout : ",layout);


    this.setState({
      displayEditItemModal : false,
      editItemData : null
    });

    this.props.updateLayout(layout);

  }

  handleOnUpdateField(field) {

    var data = field;

    //update data to pathToIndex
    console.log("handleOnUpdateField => ", this.state.editItemData.pathToIndex, data);

    var layout = this.props.layout;

    layout = this.changeItemWithCallback(layout,-1,this.state.editItemData.pathToIndex,data,
      function(field,newField){
         //field.value = newField.value;
         //field.settings = newField.settings;
         return newField;
      }
    );

    console.log("handleOnUpdateField : layout : ",layout);

    this.props.updateLayout(layout);

  }



  handleOnAddListField(field) {

    var data = field;

    //update data to pathToIndex
    //console.log("handleOnEditField => ", this.state.editItemData.pathToIndex, data);

    var layout = this.props.layout;

    layout = this.changeItemWithCallback(layout,-1,this.state.editItemData.pathToIndex,data, function(field,data){
         if(field.value === undefined || field.value == null){
           field.value = [];
         }
         field.value.push(data);
         return field;
     });

    //console.log("handleOnEditField : layout : ",layout);
    this.props.updateLayout(layout);

  }

  handleOnRemoveField(index) {

    var data = null;

    //update data to pathToIndex
    //console.log("handleOnEditField => ", this.state.editItemData.pathToIndex, data);

    var layout = this.props.layout;

    layout = this.changeItemWithCallback(layout,-1,this.state.editItemData.pathToIndex,data, function(field,data){
         field.value.splice(index, 1);
         return field;
     });

    //console.log("handleOnEditField : layout : ",layout);
    this.props.updateLayout(layout);
  }

  /******** Images  ********/

  handleImageSelect(field,callback) {

    var listItemIndex = -1;
    //FIXME try to find a more elegant way
    if(field.type !== undefined && field.type == "list-item"){
      //if the event came from the list item, then save the array of the fields
      listItemIndex = field.index;
    }

    console.log("PageBuilder :: handleImageSelect :: field.type => ",field.type);

    this.setState({
      displayMediaModal : true,
      mediaType : field.type ,
      listItemIndex : listItemIndex,
      imageCallback : callback !== undefined ? callback : null
    });

  }

  handleImageCancel(){
    this.setState({
      displayMediaModal : false,
      mediaType : null ,
      listItemIndex : -1,
      imageCallback : null
    });
  }

  handleImageSelected(media){
      this.updateImage(media);
  }

  updateImage(media){

      var layout = this.props.layout;
      var field = this.state.editItemData.data.field;
      var self = this;


      switch (field.type) {
          case FIELDS.IMAGES.type:
              layout = this.addItem(layout,-1,this.state.editItemData.pathToIndex,media);
              break;

          case FIELDS.IMAGE.type:
              layout = this.changeItem(layout,-1,this.state.editItemData.pathToIndex,media);
              break;

          case FIELDS.TRANSLATED_FILE.type:
              layout = this.changeItemWithCallback(layout,-1,
                this.state.editItemData.pathToIndex,media,
                this.state.imageCallback
              );
              break;

          case "widget":
          case "widget-list":

              layout = this.changeItemWithCallback(layout,
                -1,this.state.editItemData.pathToIndex,media,
                this.state.imageCallback
              );

              break;
        }

        this.setState({
          displayMediaModal : false,
          listItemIndex : -1,
          mediaType : null ,
          imageCallback : null
        });

        this.props.updateLayout(layout);
  }

  /******** Contents  ********/

  /**
  *   The last field is used to pass information from widgets.
  */
  handleContentSelect(identifier,callback,field) {

    var listItemIndex = -1;
    //FIXME try to find a more elegant way
    if(identifier.type !== undefined && identifier.type == "list-item"){
      //if the event came from the list item, then save the array of the fields
      listItemIndex = identifier.index;
    }

    var contentField = this.state.editItemData != null ?
      this.state.editItemData.data.field : null;

    if(field !== undefined){
      contentField = field;
    }

    console.log("PageBuilder :: handleContentSelect :: contentField => ",contentField);

    this.setState({
      displayContentModal : true,
      contentField : contentField,
      listItemIndex : listItemIndex,
      contentCallback : callback !== undefined ? callback : null
    });

  }

  handleContentCancel(){
    this.setState({
      displayContentModal : false,
      contentField : null,
      listItemIndex : -1,
      contentCallback : null
    });
  }

  handleContentSelected(content){
      this.updateContent(content);
  }

  updateContent(content){

    var self = this;
    var layout = this.props.layout;
    var field = this.state.editItemData.data.field;

    switch (field.type) {

        case FIELDS.CONTENTS.type:
            layout = this.addItem(layout,-1,this.state.editItemData.pathToIndex,content);
            break;

        case FIELDS.LINK.type:
            layout = this.changeItemWithCallback(layout,-1,this.state.editItemData.pathToIndex,content,
                function(field,data){

                    if(field.value == null){
                      field.value = {};
                    }
                    else if(field.value.url !== undefined){
                      delete field.value['url'];
                    }
                    field.value.content = content;
                    //console.log("field al final => ",field);

                    return field;
                }
            );
            break;

        case "widget":
        case "widget-list":
            layout = this.changeItemWithCallback(layout,
              -1,this.state.editItemData.pathToIndex,content,
              this.state.contentCallback
            );
            break;

    }

    this.setState({
      displayContentModal : false,
      contentField : null,
      listItemIndex : -1,
      contentCallback : null
    });

    this.props.updateLayout(layout);

  }


  render() {

    //console.log("PageBuilder :: editItemData => ",this.state.editItemData);

    return (
      <div className="col-xs-9 page-content page-builder">

        <MediaSelectModal
          display={this.state.displayMediaModal}
          onImageSelected={this.handleImageSelected.bind(this)}
          onImageCancel={this.handleImageCancel.bind(this)}
          mediaType={this.state.mediaType}
          zIndex={10000}
        />

        <ContentSelectModal
          display={this.state.displayContentModal}
          field={this.state.contentField}
          onContentSelected={this.handleContentSelected}
          onContentCancel={this.handleContentCancel}
          zIndex={10000}
        />

        {/* Modal to Edit the class or the id of the rows and the cols, */}
        <ModalEditClass
          display={this.state.displayClassModal}
          item={this.state.editItemData}
          onSubmit={this.handleItemClassSelected.bind(this)}
          onCancel={this.handleItemClassCancel.bind(this)}
          zIndex={9000}
        />

        <ModalSelectItem
          display={this.state.displayItemModal}
          onItemSelected={this.handleItemSelected}
          onContentSelect={this.handleContentSelect}
          onItemCancel={this.handleItemCancel}
          zIndex={9000}
        />

        <ModalEditItem
          display={this.state.displayEditItemModal}
          onItemCancel={this.handleEditItemCancel.bind(this)}
          item={this.state.editItemData}
          translations={this.props.translations}
          onUpdateData={this.handleOnUpdateField.bind(this)}
          onSubmitData={this.handleOnEditField.bind(this)}
          onImageSelect={this.handleImageSelect.bind(this)}
          onContentSelect={this.handleContentSelect.bind(this)}
          onAddField={this.handleOnAddListField.bind(this)}
          onRemoveField={this.handleOnRemoveField.bind(this)}
          zIndex={9000}
        />

        <div className="field-group">
          <TextField
            field={this.props.title}
            translations={this.props.translations}
            onFieldChange={this.props.onFieldChange}
            errors={this.props.errors.title}
          />

          <SlugField
            field={this.props.slug}
            sourceField={this.props.title}
            blocked={this.props.saved}
            translations={this.props.translations}
            onFieldChange={this.props.onFieldChange}
            errors={this.props.errors.slug}
          />

          {this.props.layout != null &&
            this.renderRows()
          }

          {!architect.currentUserHasRole('author') &&
            <FirstEmptyRow
              onAddRow={this.handleAddRow}
            />
          }

        </div>
      </div>
    );
  }

}
export default PageBuilder;
