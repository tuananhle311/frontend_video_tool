<template>
  <v-card variant="outlined" class="pa-3">
    <v-row>
      <!-- COL 1: SỐ + TEXT SCRIPT (7 cols) -->
      <v-col cols="8">
        <div class="d-flex align-start gap-3">
          {{ index + 1 }}.
          <div class="flex-grow-1">
            <v-textarea
              v-if="isEditing"
              v-model="editableText"
              variant="outlined"
              auto-grow
              rows="3"
              density="compact"
              hide-details
            ></v-textarea>
            <p
              v-else
              class="text-body-2 mb-0"
              style="
                white-space: pre-wrap;
                word-wrap: break-word;
                text-align: start;
              "
            >
              {{ promptText }}
            </p>
          </div>
        </div>
      </v-col>

      <!-- COL 2: BUTTONS (2 cols) -->
      <v-col cols="2">
        <div class="d-flex flex-column gap-1">
          <v-btn
            v-if="isEditing"
            icon="mdi-check"
            size="small"
            variant="text"
            color="green"
            @click="saveEdit"
          ></v-btn>
          <v-btn
            v-if="isEditing"
            icon="mdi-close"
            size="small"
            variant="text"
            color="red"
            @click="cancelEdit"
          ></v-btn>
          <v-btn
            v-else
            icon="mdi-pencil"
            size="small"
            variant="text"
            @click="startEdit"
          ></v-btn>
          <v-btn
            icon="mdi-content-copy"
            size="small"
            variant="text"
            @click="copyPrompt"
          ></v-btn>
          <v-btn
            icon="mdi-image-plus"
            size="small"
            variant="text"
            color="blue"
            :loading="isGeneratingImage"
            @click="generateImage"
            title="Tạo ảnh miễn phí"
          ></v-btn>
          <v-btn
            v-if="generatedImage"
            icon="mdi-download"
            size="small"
            variant="text"
            color="green"
            @click="downloadImage"
            title="Tải xuống ảnh"
          ></v-btn>
        </div>
      </v-col>

      <!-- COL 3: ẢNH TẠO RA (3 cols) -->
      <v-col cols="2">
        <div v-if="generatedImage" class="text-center">
          <v-img
            :src="generatedImage.imageUrl"
            aspect-ratio="3/4"
            class="rounded mb-2"
          ></v-img>
          <v-chip color="success" size="small" prepend-icon="mdi-check-circle">
            {{ generatedImage.timestamp }}
          </v-chip>
        </div>
        <div v-else class="text-center text-grey-400 pa-4">
          <v-icon size="48" color="grey-300">mdi-image-outline</v-icon>
          <p class="text-caption mt-2">Chưa tạo ảnh</p>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: "PromptItem",
  props: {
    promptText: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    isGeneratingImage: {
      type: Boolean,
      default: false,
    },
    generatedImage: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      isEditing: false,
      editableText: "",
    };
  },
  emits: ["update-prompt", "copy-prompt", "generate-image", "download-image"],
  methods: {
    startEdit() {
      this.isEditing = true;
      this.editableText = this.promptText;
    },
    saveEdit() {
      this.$emit("update-prompt", this.index, this.editableText);
      this.isEditing = false;
    },
    cancelEdit() {
      this.isEditing = false;
      this.editableText = "";
    },
    copyPrompt() {
      this.$emit("copy-prompt", this.promptText);
    },
    generateImage() {
      this.$emit("generate-image", this.index, this.promptText);
    },
    downloadImage() {
      this.$emit("download-image", this.index);
    },
  },
};
</script>
