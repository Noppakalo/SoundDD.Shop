<!-- <template>
  <template>
    <section class="py-15">
      <UContainer class="flex items-center">
        <UMarquee pause-on-hover :overlay="false" class="gap-20">
          <NuxtImg
            v-for="(item, index) in logos"
            :key="index"
            :src="item.src"
            :alt="item.name"
            loading="lazy"
            draggable="false"
            class="h-10 w-auto shrink-0 object-contain"
          />
        </UMarquee>
      </UContainer>
    </section>
  </template>

  <script setup lang="ts">
    interface DealerLogo {
      name: string;
      src: string;
    }

    const logos: DealerLogo[] = [
      { name: "SoundDD", src: "/images/clients/logo-SoundDD.webp" },
      { name: "SOUNDVISION", src: "/images/clients/logo-Soundvision.webp" },
      { name: "SKYMASTER", src: "/images/clients/logo-Skymaster.webp" },
      { name: "AMATA", src: "/images/clients/logo-Amata.webp" },
    ];
  </script>
</template> -->
