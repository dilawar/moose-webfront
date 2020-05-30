<template>
  <f7-page name="settings">
    <f7-navbar title="Settings"></f7-navbar>

    <f7-block-title>Server settings</f7-block-title>
    <f7-list no-hairlines-md>
      <f7-list-input
        label="MOOSE Server Location (IP Address)"
        type="url"
        required validate
        placeholder="http://localhost"
      ></f7-list-input>

      <f7-list-input
        label="MOOSE Server port"
        type="number"
        placeholder="31417"
      ></f7-list-input>

      <f7-list-item>
        <f7-button slot="after" raised>Update</f7-button>
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>
