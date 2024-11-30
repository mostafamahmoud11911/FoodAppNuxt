<template>
  <div class="auth-layout">
    <div class="content flex items-center justify-center h-full">
      <div class="md:w-1/2 w-full bg-white p-8 rounded-md">

        <div class="img-container">
            <img src="../assets/images/logo.png" alt="">
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  background-image: url(../assets/images/auth-bg.png);
  background-size: cover;
  height: 100vh;
  width: 100%;
}
.content {
  background: linear-gradient(rgba(47, 140, 96, 0.4), rgba(0, 0, 0, 0.7));
}
.img-container{
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.img-container img{
    width: 250px;
}
</style>
