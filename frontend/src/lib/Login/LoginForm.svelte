<script lang="ts">
</script>

<div>
	<section class="container mx-auto px-4 py-4">
		<div class="flex flex-col justify-center items-center min-h-[40rem]">
			<h3 class="text-2xl text-slate-500">😁 Registration Forms 👍</h3>
			​
			<div class="w-3/6 mt-4 rounded-sm p-8 bg-slate-100">
				<form class="my-4" action="?/contactus" method="POST">
					<div>
						<label class="label text-slate-500 mr-4" for="name"
							>Name
						</label>
						<input
							type="text"
							name="name"
							placeholder="Type here"
							class="ring-1 ring-slate-200 focus:outline-none rounded-sm input w-full"
						/>
					</div>
					<div>
						<label class="label text-slate-500 mr-4" for="name"
							>Email
						</label>
						<input
							type="email"
							name="email"
							placeholder="Type here"
							class="ring-1 ring-slate-200 focus:outline-none rounded-sm input w-full"
						/>
					</div>
					<div>
						<label class="label text-slate-500 mr-4" for="name"
							>Password
						</label>
						<input
							type="password"
							name="password"
							placeholder="Type here"
							class="ring-1 ring-slate-200 focus:outline-none rounded-sm input w-full"
						/>
					</div>
				</form>
			</div>
		</div>
	</section>
</div>
