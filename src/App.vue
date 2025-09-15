<template>
  <v-container
    fluid
    style="
      width: 100vw;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: start;
      padding: 10px;
      text-align: center;
      background-color: #edede9;
    "
  >
    <v-text-field
      v-model="voiceId"
      label="Voice ID"
      width="100%"
      variant="outlined"
      type="password"
    />
    <v-text-field
      v-model="apiKey"
      label="Api Key"
      width="100%"
      variant="outlined"
      type="password"
    />
    <v-card
      title="Tạo video từ kịch bản"
      width="100%"
      height="auto"
      style="padding: 20px"
    >
      <v-textarea
        v-model="script"
        clear-icon="mdi-close-circle"
        label="Kịch bản"
        variant="solo"
        clearable
        class="scriptInput"
        style="min-height: 40vh"
      ></v-textarea>
      <template v-slot:actions>
        <v-btn
          append-icon="mdi-chevron-right"
          color="red-lighten-2"
          text="Chia kịch bản"
          variant="elevated"
          block
          @click="handleSplitScript()"
        ></v-btn>
      </template>
    </v-card>

    <v-col
      v-for="(scriptContent, index) in scriptsResult"
      :key="index"
      cols="12"
    >
      <v-row>
        <v-col cols="8">
          <v-card
            class="pa-4"
            :title="`Kịch bản ${index + 1}`"
            style="text-align: start"
          >
            <v-card-text>{{ scriptContent }}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card height="100%">
            <template v-slot:actions>
              <v-btn
                color="red-lighten-2"
                text="Tạo giọng nói"
                variant="elevated"
                block
                @click="handleSplitScript()"
              ></v-btn> </template
          ></v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<style scoped>
.card {
  overflow-y: scroll;
}
</style>
<script setup lang="ts">
import { ref } from "vue";
import { splitScripts } from "./utils/functions";

const script = ref("This is clearable text.");
const scriptsResult = ref<string[]>([]);
const apiKey = ref("");
const voiceId = ref("");

const handleSplitScript = () => {
  scriptsResult.value = splitScripts(script.value);
};

const textToSpeech = async (text: string) => {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId.value}`,
    {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey.value,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
      }),
    }
  );

  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
};
</script>
