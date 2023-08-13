<template>
    <div class="about">
        <h5>{{ $t('system.aboutSoftware.statement') }}: </h5>
        <p>{{ $t('system.aboutSoftware.statementContent') }}</p>
        <h5>{{ $t('system.aboutSoftware.contactInformation') }}: </h5>
        <p>
            Email: <email>czpk673@gmail.com</email>
        </p>
    </div>
</template>
<style scoped>
.about {
    padding: 10px;
}

.about h5 {
    padding: 20px;
}

.about p {
    text-indent: 2em;
}

.about p email {
    color: royalblue;
    font-style: italic;
}
</style>
