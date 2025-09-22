# Component Structure Documentation

## ActionScript.vue Complete Structure

```vue
<template>
  <v-col cols="12">
    <v-row>
      <!-- Script Content Card -->
      <v-col cols="8">
        <v-card
          class="pa-4"
          :title="`Kịch bản ${index + 1} - ${scriptContent.length}/1000 ký tự`"
          style="text-align: start"
        >
          <v-card-text>{{ scriptContent }}</v-card-text>
        </v-card>
      </v-col>

      <!-- Action Card -->
      <v-col cols="4">
        <v-card height="100%" class="d-flex flex-column">
          <!-- Audio Player Section (only when audioUrl exists) -->
          <v-card-text v-if="audioUrl" class="flex-grow-1">
            <audio controls :src="audioUrl" class="w-100 mb-2"></audio>
            <v-btn
              color="green"
              text="Tải xuống"
              variant="outlined"
              block
              prepend-icon="mdi-download"
              @click="downloadAudio"
            ></v-btn>
          </v-card-text>

          <!-- Generate Speech Button -->
          <template v-slot:actions>
            <v-btn
              color="red-lighten-2"
              text="Tạo giọng nói"
              variant="elevated"
              block
              :loading="isLoading"
              @click="handleTextToSpeech"
            ></v-btn>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
export default {
  name: "ActionScript",
  props: {
    scriptContent: { type: String, required: true },
    index: { type: Number, required: true },
    apiKey: { type: String, required: true },
    voiceId: { type: String, required: true },
  },
  data() {
    return {
      isLoading: false,
      audioUrl: null,
    };
  },
  emits: ["split-script"],
  methods: {
    handleSplitScript() {
      this.$emit("split-script", this.index);
    },
    async handleTextToSpeech() {
      // API validation
      if (!this.apiKey || !this.voiceId) {
        alert("Vui lòng nhập API Key và Voice ID");
        return;
      }

      this.isLoading = true;
      try {
        // Call ElevenLabs API
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`,
          {
            method: "POST",
            headers: {
              Accept: "audio/mpeg",
              "Content-Type": "application/json",
              "xi-api-key": this.apiKey,
            },
            body: JSON.stringify({
              text: this.scriptContent,
              model_id: "eleven_monolingual_v1",
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Lỗi khi tạo giọng nói");
        }

        // Create audio URL for player
        const audioBlob = await response.blob();
        this.audioUrl = URL.createObjectURL(audioBlob);
      } catch (error) {
        console.error("Lỗi:", error);
        alert("Có lỗi xảy ra khi tạo giọng nói");
      } finally {
        this.isLoading = false;
      }
    },
    downloadAudio() {
      if (this.audioUrl) {
        const link = document.createElement("a");
        link.href = this.audioUrl;
        link.download = `script_${this.index + 1}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
  },
};
</script>
```

## App.vue Integration

```vue
<!-- In template section -->
<ActionScript
  v-for="(scriptContent, index) in scriptsResult"
  :key="index"
  :script-content="scriptContent"
  :index="index"
  :api-key="apiKey"
  :voice-id="voiceId"
  @split-script="handleSplitScript"
/>

<!-- In script section -->
import ActionScript from "./components/ActionScript.vue";

export default {
  components: {
    ActionScript
  },
  // ... rest of component logic
}
```